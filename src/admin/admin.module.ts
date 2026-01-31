import { Module } from '@nestjs/common';
import { KmzModule } from './kmz/kmz.module';
import { LayersModule } from './layers/layers.module';

@Module({
  imports: [LayersModule, KmzModule],
})
export class AdminModule {}
