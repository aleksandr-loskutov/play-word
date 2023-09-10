import { customNotification } from '../components/custom-notification/customNotification';

export function validateArrayForEmptyStringAndLength(
  arr,
  fields,
  minLength = 2,
  maxLength = 45,
) {
  const errors = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    for (const field of fields) {
      // Check for empty string
      if (typeof item[field] === 'string' && item[field].trim() === '') {
        errors.push(
          `Ошибка валидации: ${field} на строке ${i + 1} не должно быть пустым`,
        );
      }

      // Check for min length
      if (typeof item[field] === 'string' && item[field].length < minLength) {
        errors.push(
          `Ошибка валидации: ${field} на строке ${
            i + 1
          } должно быть больше ${minLength} символов`,
        );
      }

      // Check for max length
      if (typeof item[field] === 'string' && item[field].length > maxLength) {
        errors.push(
          `Ошибка валидации: ${field}  на строке ${
            i + 1
          } должно быть меньше ${maxLength} символов`,
        );
      }
    }
  }

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
