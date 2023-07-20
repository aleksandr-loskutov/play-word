import { Rule } from 'antd/lib/form'

const TRAINING_INTERVAL_RULES = [
  { required: true, message: 'Введите значение интервала' },
  {
    type: 'number',
    min: 1,
    message: 'Не менее 1',
  },
] as Rule[]

const TRAINING_COUNTDOWN_RULES = [
  {
    required: true,
    message: 'Введите значение для времени обратного отсчета',
  },
  {
    type: 'number',
    min: 5,
    message: 'Не менее 5 секунд',
  },
] as Rule[]

const TRAINING_WORDS_PER_SESSION_RULES = [
  {
    required: true,
    message: 'Введите значение для слов на сессию',
  },
  {
    type: 'number',
    min: 1,
    max: 100,
    message: 'Не менее 1 и не более 100',
  },
] as Rule[]

const TRAINING_ERROR_RULES = [
  {
    required: true,
    message: 'Введите значение для лимита ошибок на слово',
  },
  {
    type: 'number',
    min: 0,
    message: 'Не менее 0',
  },
] as Rule[]

const TRAINING_MISTYPE_RULES = [
  {
    required: true,
    message: 'Введите значение для лимита опечаток на слово',
  },
  {
    type: 'number',
    min: 0,
    message: 'Не менее 0',
  },
] as Rule[]

export {
  TRAINING_INTERVAL_RULES,
  TRAINING_MISTYPE_RULES,
  TRAINING_ERROR_RULES,
  TRAINING_COUNTDOWN_RULES,
  TRAINING_WORDS_PER_SESSION_RULES,
}
