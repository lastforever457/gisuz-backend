import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from 'generated/prisma';

export class FilterDto {
  @ApiProperty({ example: 'search', required: false })
  search?: string;

  @ApiProperty({ example: 'skip', required: false })
  skip?: number;

  @ApiProperty({ example: 'take', required: false })
  take?: number;

  @ApiProperty({ example: 'orderBy', required: false })
  orderBy?: Prisma.LayerOrderByWithRelationInput;
}
