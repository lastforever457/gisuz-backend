import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from './filter.dto';

@Injectable()
export class LayersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLayers(filterDto: FilterDto) {
    const where: Prisma.LayerWhereInput = {};

    if (filterDto.search) {
      where.OR = [
        {
          global_id: {
            contains: filterDto.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const total = await this.prisma.layer.count({ where });
    const data = await this.prisma.layer.findMany({
      where,
      skip: Number(filterDto.skip) ? Number(filterDto.skip) : undefined,
      take: Number(filterDto.take) ? Number(filterDto.take) : 30,
      orderBy: filterDto.orderBy ? filterDto.orderBy : undefined,
    });

    return {
      data,
      total,
    };
  }

  async getLayerById(id: string) {
    return this.prisma.layer.findUnique({ where: { id } });
  }

  async createLayer(data: Prisma.LayerCreateInput) {
    return this.prisma.layer.create({ data });
  }

  async updateLayer(id: string, data: Prisma.LayerUpdateInput) {
    return this.prisma.layer.update({ where: { id }, data });
  }

  async deleteLayer(id: string) {
    return this.prisma.layer.delete({ where: { id } });
  }

  async updateChartData(id: string, chartData: any) {
    return this.prisma.layer.update({
      where: { id },
      data: { chartData },
    });
  }
}
