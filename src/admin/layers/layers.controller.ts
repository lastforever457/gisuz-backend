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
import { HttpStatusCode } from 'axios';
import { Prisma } from 'generated/prisma';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { FilterDto } from './filter.dto';
import { LayersService } from './layers.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin - Layers')
@Controller('admin/layers')
export class LayersController {
  constructor(private readonly layersService: LayersService) {}

  @Get('all')
  @HttpCode(HttpStatusCode.Ok)
  @ApiOperation({ summary: 'Get all layers' })
  getAllLayers(@Query() filterDto: FilterDto) {
    return this.layersService.getAllLayers(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatusCode.Ok)
  @ApiOperation({ summary: 'Get layer by id' })
  getLayerById(@Param('id') id: string) {
    return this.layersService.getLayerById(id);
  }

  @Post()
  @HttpCode(HttpStatusCode.Created)
  @ApiOperation({ summary: 'Create layer' })
  createLayer(@Body() data: Prisma.LayerCreateInput) {
    return this.layersService.createLayer(data);
  }

  @Patch('chart-data/:id')
  @HttpCode(HttpStatusCode.Created)
  @ApiOperation({ summary: 'Update layer chart data by id' })
  updateChartData(@Param('id') id: string, @Body() chartData: any) {
    return this.layersService.updateChartData(id, chartData);
  }

  @Patch(':id')
  @HttpCode(HttpStatusCode.Created)
  @ApiOperation({ summary: 'Update layer by id' })
  updateLayer(@Param('id') id: string, @Body() data: Prisma.LayerUpdateInput) {
    return this.layersService.updateLayer(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatusCode.Created)
  @ApiOperation({ summary: 'Delete layer by id' })
  deleteLayer(@Param('id') id: string) {
    return this.layersService.deleteLayer(id);
  }
}
