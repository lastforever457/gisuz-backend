import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { KmzService } from './kmz.service';

@ApiTags('Admin - KMZ')
@Controller('kmz')
export class KmzController {
  constructor(private readonly kmzService: KmzService) {}

  @Get()
  async getAll() {
    return await this.kmzService.getAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          const originalName = file.originalname.split('.')[0];

          const cleanName = originalName.replace(/\s+/g, '_');

          const filename = `${cleanName}-${uniqueSuffix}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File) {
    return await this.kmzService.create(file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.kmzService.delete(id);
  }
}
