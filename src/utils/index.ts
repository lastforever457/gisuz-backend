import { HttpException, HttpStatus } from '@nestjs/common';
import dayjs, { Dayjs } from 'dayjs';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';

export const appDir = path.dirname(process.execPath);

export const asyncLog = async (...messages: any) => {
  console.log(...messages);
};

export const createFolder = (folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
};

export const deleteFiles = (paths, getFile) => {
  if (!Array.isArray(paths)) paths = [paths];

  try {
    paths.map((path) => {
      fs.unlinkSync(getFile ? getFile(path) : path);
    });
  } catch (error) {
    asyncLog(error);
  }
};

export const getTimeStampStr = () => {
  const date = moment().format('DD.MM.YYYY');
  const time = moment().format('HH_mm_ss.SSS');
  const timestamp = `${date}T${time}`;
  return timestamp;
};

export const getDateStr = () => moment().format('DD.MM.YYYY');

export const throwHttpException = (e, status?: number) => {
  throw new HttpException(
    {
      status: status || HttpStatus.BAD_REQUEST,
      error: e,
      error_msg: e.message,
    },
    HttpStatus.BAD_REQUEST,
  );
};

export const catchAsync = async (fn) => {
  try {
    return await fn();
  } catch (e) {
    asyncLog(e);
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: e,
        error_msg: e.message.split('\n'),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const tryCatch = (fn: Function) => {
  try {
    return fn();
  } catch (e) {
    asyncLog(e);
  }
};

export const tryCatchAsync = async (fn: Function) => {
  try {
    return await fn();
  } catch (e) {
    asyncLog(e);
  }
};

export function getCurrentUtcDate(): Dayjs {
  return dayjs().startOf('day');
}

export function getCurrentUtcTime(): Dayjs {
  return dayjs();
}

export function getCurrentUtcTimeFormat(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

export function urlJoin(url, ...paths) {
  return new URL(path.join(...paths), url).href;
}

import * as ExcelJS from 'exceljs';

export async function exportToExcel(
  data: Record<string, any>[],
  sheetName = 'Sheet1',
): Promise<Buffer> {
  if (!data || data.length === 0) {
    throw new Error("Data bo'sh bo'lmasligi kerak");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map((key) => ({
    header: key.toUpperCase(),
    key,
    width: 20,
  }));

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
