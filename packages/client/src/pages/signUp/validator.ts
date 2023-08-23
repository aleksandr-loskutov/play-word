import { Indexable } from '../../types/common'
import { Rule } from 'antd/lib/form'

const CIRILLIC_OR_LATIN_REGEXP = /^[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ-]*$/g
const CHECK_NUMBER_REGEXP = /(?=.*\d)/
const signUpRules: Indexable<Rule[]> = {
  email: [
    {
      type: 'email',
      message: 'Введите корректный адрес почты',
    },
    {
      required: true,
      message: 'Введите почту',
    },
  ],
  name: [
    { required: true, message: 'Введите имя' },
    {
      pattern: CIRILLIC_OR_LATIN_REGEXP,
      message: 'латиница или кириллица',
    },
  ],

  password: [
    {
      required: false,
      message: 'Введите пароль',
    },
    { min: 8, message: 'Не менее 8 символов' },
    {
      pattern: CHECK_NUMBER_REGEXP,
      message: 'Должен содержать хотя бы одну цифру',
    },
  ],
}

export default signUpRules
