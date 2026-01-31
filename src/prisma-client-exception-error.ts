import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { Prisma } from 'generated/prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  async catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const locale = request.cookies['intl-locale'] || 'uzb';

    let aiMessage = exception.message;
    try {
      const aiResponse = await axios.post(
        'https://codestral.mistral.ai/v1/chat/completions',
        {
          model: 'codestral-latest',
          messages: [
            {
              role: 'system',
              content: `Sen xatolarni foydalanuvchiga chiroyli, aniq va tushunarli qilib izohlaysan, ortiqcha matnlar kerak emas. Xatoni 1ta qisqa gap bilan aniq qilib tushuntir. field nomlarini alohida ajratib yozma, gap ichida uyg'unlashtir. Matn ${locale} tilida gramatik va sintaktik xatosiz bo'lsin`,
            },
            {
              role: 'user',
              content: `Prisma error: ${exception.message} (code: ${exception.code})`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer fnHOj5iGOFQ5gGDfGYQkeyswNNFiuUPV`, // tokeningizni env’da saqlang
            'Content-Type': 'application/json',
          },
        },
      );

      aiMessage = aiResponse.data.choices[0].message.content;
    } catch (err) {
      console.error('AI formatting error:', err.message);
    }
    response.status(status).json({
      statusCode: status,
      message: `${aiMessage}`,
      error: exception.code,
    });
  }
}
