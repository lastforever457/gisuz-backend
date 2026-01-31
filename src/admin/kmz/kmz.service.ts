import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { throwHttpException } from 'src/utils';

@Injectable()
export class KmzService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    try {
      const res = await this.prisma.kmz.findMany();
      return res;
    } catch (e) {
      throwHttpException(e);
    }
  }

  async create(file: Express.Multer.File) {
    try {
      const res = await this.prisma.kmz.create({
        data: {
          fileName: file.filename,
          path: file.path,
        },
      });
      return res;
    } catch (e) {
      throwHttpException(e);
    }
  }

  async delete(id: string) {
    try {
      const res = await this.prisma.kmz.findUnique({ where: { id } });
      if (res?.path) {
        fs.unlinkSync(res.path);
      }
      await this.prisma.kmz.delete({ where: { id } });
      return res;
    } catch (e) {
      throwHttpException(e);
    }
  }
}
