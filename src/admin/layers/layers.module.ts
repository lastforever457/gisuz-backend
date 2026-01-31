import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LayersController } from './layers.controller';
import { LayersService } from './layers.service';

@Module({
  controllers: [LayersController],
  providers: [LayersService, PrismaService, JwtService],
})
export class LayersModule {}
