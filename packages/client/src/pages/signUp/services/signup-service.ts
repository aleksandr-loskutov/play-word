import AuthAPI from '../../../api/auth'
import { SignUpDTO } from '../../../types/auth'
import { ApiResponse } from '../../../types/api'
import { UserEntity } from '../../../types/user'

const signUp = async (payload: SignUpDTO): ApiResponse<UserEntity> => {
  const response = await AuthAPI.signUp(payload)
  console.log('response', response)

  if (response.error || !response.data) {
    return { error: 'Не удалось получить пользователя' }
  }

  return { data: response.data }
}

export default signUp
