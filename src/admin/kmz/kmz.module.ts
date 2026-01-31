import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { KmzController } from './kmz.controller';
import { KmzService } from './kmz.service';

@Module({
  controllers: [KmzController],
  providers: [KmzService, PrismaService, JwtService],
})
export class KmzModule {}
