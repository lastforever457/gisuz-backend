import { Injectable } from '@nestjs/common';
import { uploadFile } from 'src/utils/file-upload';

@Injectable()
export class FileService {
  constructor() {}
  async create(file: Express.Multer.File) {
    return await uploadFile(file);
  }
}
