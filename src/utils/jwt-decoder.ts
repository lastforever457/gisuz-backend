import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

export async function extractUserFromRequest({
  req,
  prisma,
  jwtService,
  configService,
  options,
}: {
  req: any;
  prisma: PrismaService;
  jwtService: JwtService;
  configService: ConfigService;
  options?: Record<string, any>;
}) {
  const authHeader = req.headers?.['authorization'];
  if (!authHeader) throw new Error('Authorization header topilmadi');

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) throw new Error('Token topilmadi');

  const payload = jwtService.verify(token, {
    secret: configService.get('JWT_SECRET'),
  });
  if (!payload) throw new Error('Tokenni ochib bo‘lmadi');

  const user = await prisma.user.findUnique({
    where: { username: payload.username },
    omit: { password: true },
    ...options,
  });
  if (!user) throw new Error('Foydalanuvchi topilmadi');

  return user;
}
