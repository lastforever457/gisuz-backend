import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractUserFromRequest } from 'src/utils/jwt-decoder';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(body: any, headers: any) {
    const { username, password } = body;

    if (!username) throw new BadRequestException('Username is required');
    if (!password) throw new BadRequestException('Password is required');

    const existingUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!existingUser) throw new BadRequestException('User not found');
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password || '',
    );
    if (!isPasswordMatch) throw new BadRequestException('Invalid password');

    const token = await this.jwtService.signAsync(
      {
        username: existingUser.username,
        role: existingUser.role,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      },
    );

    return {
      token,
      user: {
        username: existingUser.username,
        role: existingUser.role,
      },
    };
  }

  async me(req: Request) {
    const user = await extractUserFromRequest({
      req,
      prisma: this.prisma,
      jwtService: this.jwtService,
      configService: this.configService,
    });

    if (!user) throw new BadRequestException('User not found');

    return user;
  }
}
