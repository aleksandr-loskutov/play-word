import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

function handleError(error: any, customMessage?: string): never {
  // Prisma error handling
  if (error instanceof PrismaClientKnownRequestError) {
    const message = customMessage || '';
    switch (error.code) {
      case 'P2002':
        throw new ForbiddenException(message || 'Запись уже существует.');
      case 'P2010':
        throw new NotFoundException(message || 'Не найдено.');
      case 'P2016':
        throw new BadRequestException(message || 'Не правильный запрос.');
      default:
        throw new NotFoundException(message || 'Неизвестная ошибка.');
    }
  }
  // Custom ForbiddenException handling
  else if (error instanceof ForbiddenException) {
    throw new ForbiddenException(customMessage || error.message);
  }
  // Other HttpException types (from NestJS)
  else if (error instanceof HttpException) {
    throw new HttpException(customMessage || error.message, error.getStatus());
  }
  // Default case for unknown errors
  else {
    throw new NotFoundException(customMessage || 'Unknown error.');
  }
}

export default handleError;
