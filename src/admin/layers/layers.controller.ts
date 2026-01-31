import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from 'generated/prisma';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { FilterDto } from './filter.dto';
import { LayersService } from './layers.service';

@ApiTags('Admin - Layers')
@Controller('admin/layers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'USER')
export class LayersController {
  constructor(private readonly layersService: LayersService) {}

  @Get('all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all layers' })
  getAllLayers(@Query() filterDto: FilterDto) {
    return this.layersService.getAllLayers(filterDto);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get layer by id' })
  getLayerById(@Param('id') id: string) {
    return this.layersService.getLayerById(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create layer' })
  createLayer(@Body() data: Prisma.LayerCreateInput) {
    return this.layersService.createLayer(data);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update layer by id' })
  updateLayer(@Param('id') id: string, @Body() data: Prisma.LayerUpdateInput) {
    return this.layersService.updateLayer(id, data);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete layer by id' })
  deleteLayer(@Param('id') id: string) {
    return this.layersService.deleteLayer(id);
  }
}
