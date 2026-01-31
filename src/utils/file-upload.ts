import { getTimeStampStr } from './index';

export type UploadedFile = { name: string; uploadPath: string };

export const uploadFile = async (
  file: Express.Multer.File,
): Promise<UploadedFile> => {
  const name = Buffer.from(file.originalname, 'latin1').toString('utf8');

  const idx = name.lastIndexOf('.');
  const ext = name.slice(idx).toLowerCase();
  let fileName = `${getTimeStampStr()}-${name.slice(0, idx).trim()}`;

  let uploadPath: string = file?.path;

  // uploads dan keyingi barcha backslash va slashlarni bittagina slashga almashtiramiz
  uploadPath = uploadPath.replace(/(uploads)[\\/]+/, 'uploads/');

  // barcha backslashlarni slashga almashtiramiz (agar Windows yo'l bo'lsa)
  uploadPath = uploadPath.replace(/\\/g, '/');

  // faqat rasm formatlari uchun .webp qo'shamiz, aks holda asl kengaytmani qoldiramiz
  if (/\.(jpe?g|tiff?|png|webp|bmp|avif|gif|ico|jfif)$/i.test(name)) {
    fileName = `${fileName}.webp`;
  } else {
    fileName = `${fileName}${ext}`;
  }

  return { name: fileName, uploadPath };
};
