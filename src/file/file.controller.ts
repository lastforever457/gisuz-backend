import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { throwHttpException } from 'src/utils';
import { FileService } from './file.service';

@Controller('uploads')
export class FileController {
  constructor(private readonly uploadService: FileService) {}
  @Post('bulk')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
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
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  async bulkUpload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new Error('Hech qanday fayl yuklanmadi');
      }

      const uploadPromises = files.map((file) =>
        this.uploadService.create(file),
      );
      const results = await Promise.all(uploadPromises);

      return {
        message: 'Fayllar muvaffaqiyatli yuklandi',
        count: files.length,
        files: results.map((result, index) => ({
          originalName: files[index].originalname, // frontendga asl nomni qaytarish uchun
          filename: files[index].filename, // saqlangan xavfsiz nom
          url: `/uploads/${files[index].filename}`,
        })),
      };
    } catch (e) {
      throwHttpException(e);
    }
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
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (file) return await this.uploadService.create(file);
      else throw new Error('no file');
    } catch (e) {
      throwHttpException(e);
    }
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: any) {
    const filePath = join(process.cwd(), 'uploads', filename);
    return res.sendFile(filePath);
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);
    try {
      fs.unlinkSync(filePath);
      return { message: 'File deleted successfully' };
    } catch (e) {
      throwHttpException(e);
    }
  }
}
