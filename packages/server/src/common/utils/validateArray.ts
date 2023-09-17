import { BadRequestException } from '@nestjs/common';
import { RequestUserTrainingUpdate } from '../../collection/dto';

// we should use class-validator here, but for now we use this
function validateArrayForEmptyStringAndLength(
  arr: any[],
  fields: string[],
  minLength: number = 2,
  maxLength: number = 45
) {
  if (!Array.isArray(arr)) {
    throw new BadRequestException(`Ошибка валидации: Input is not an array.`);
  }
  arr.forEach((item, i) => {
    fields.forEach((field) => {
      // Check for empty string
      if (typeof item[field] === 'string' && item[field].trim() === '') {
        throw new BadRequestException(
          `Ошибка валидации: ${field} в индексе ${i} не должно быть пустым`
        );
      }

      // Check for min length
      if (typeof item[field] === 'string' && item[field].length < minLength) {
        throw new BadRequestException(
          `Ошибка валидации: ${field} в индексе ${i} должно быть больше ${minLength} символов`
        );
      }

      // Check for max length
      if (typeof item[field] === 'string' && item[field].length > maxLength) {
        throw new BadRequestException(
          `Ошибка валидации: ${field} в индексе ${i} должно быть меньше ${maxLength} символов`
        );
      }
    });
  });
}

export function validateUserTrainingUpdatePayloadArray(
  requestUpdates: RequestUserTrainingUpdate[]
): boolean {
  return requestUpdates.every(
    (update) =>
      typeof update.wordId === 'number' &&
      typeof update.translationId === 'number' &&
      typeof update.sessionMistakes === 'number'
  );
}

export default validateArrayForEmptyStringAndLength;
