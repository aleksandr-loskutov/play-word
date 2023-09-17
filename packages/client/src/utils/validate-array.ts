import customNotification from '../components/custom-notification/customNotification';

export default function validateArrayForEmptyStringAndLength(
  arr: any[],
  fields: string[],
  minLength = 2,
  maxLength = 45
): boolean {
  const errors: string[] = [];

  if (!Array.isArray(arr)) {
    customNotification({
      message: 'Ошибка!',
      description: 'Input is not an array.',
      type: 'error',
    });
    return false;
  }

  arr.forEach((item, i) => {
    fields.forEach((field) => {
      // Check for empty string
      if (typeof item[field] === 'string' && item[field].trim() === '') {
        errors.push(
          `Ошибка валидации: ${field} на строке ${i + 1} не должно быть пустым`
        );
      }

      // Check for min length
      if (typeof item[field] === 'string' && item[field].length < minLength) {
        errors.push(
          `Ошибка валидации: ${field} на строке ${
            i + 1
          } должно быть больше ${minLength} символов`
        );
      }

      // Check for max length
      if (typeof item[field] === 'string' && item[field].length > maxLength) {
        errors.push(
          `Ошибка валидации: ${field} на строке ${
            i + 1
          } должно быть меньше ${maxLength} символов`
        );
      }
    });
  });

  if (errors.length > 0) {
    customNotification({
      message: 'Ошибка!',
      description: errors[0],
      type: 'error',
    });
    return false;
  }
  return true;
}
