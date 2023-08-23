import AuthAPI from '../../../api/auth'
import { SignUpDTO } from '../../../types/auth'
import { ApiResponse } from '../../../types/api'
import { User } from '../../../types/user'

const signUp = async (payload: SignUpDTO): ApiResponse<User> => {
  const response = await AuthAPI.signUp(payload)

  if (response.error || !response.data) {
    return { error: 'Не удалось получить пользователя' }
  }

  return { data: response.data }
}

export default signUp
