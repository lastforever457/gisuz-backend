import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  s: ParameterObject;
  @Post('login')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Login',
    description: 'Login to get access token',
    tags: ['Authorization'],
  })
  @ApiBody({ type: LoginDto })
  login(@Body() body: any, @Req() req: any) {
    return this.authService.login(body, req.headers);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  me(@Request() req: Request) {
    return this.authService.me(req as any);
  }
}
