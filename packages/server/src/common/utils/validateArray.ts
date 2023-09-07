import { BadRequestException } from '@nestjs/common';

function validateArrayForEmptyStringAndLength(
  arr: any[],
  fields: string[],
  minLength: number = 2,
  maxLength: number = 45,
) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    for (const field of fields) {
      // Check for empty string
      if (typeof item[field] === 'string' && item[field].trim() === '') {
        throw new BadRequestException(
          `Ошибка валидации: ${field} в индексе ${i} не должно быть пустым`,
        );
      }

      // Check for min length
      if (typeof item[field] === 'string' && item[field].length < minLength) {
        throw new BadRequestException(
          `Ошибка валидации: ${field} в индексе ${i} должно быть больше ${minLength} символов`,
        );
      }

      // Check for max length
      if (typeof item[field] === 'string' && item[field].length > maxLength) {
        throw new BadRequestException(
          `Ошибка валидации: ${field} в индексе ${i} должно быть меньше ${maxLength} символов`,
        );
      }
    }
  }
}

export default validateArrayForEmptyStringAndLength;
