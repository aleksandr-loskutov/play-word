import { useCallback, ChangeEvent } from 'react'
import createCn from '../../utils/create-cn'
import { updateProfile } from '../../store/action-creators/profile'
import { RequestUserData, RequestUserDataUpdate } from '../../types/user'
import ProfileForm from './components/form'
import './style.css'
import { useAppDispatch } from '../../components/hooks/store'
import { useAuth } from '../../components/hooks/auth'
import withAuth from '../../components/hoc/withAuth'
import { customNotification } from '../../components/custom-notification/customNotification'

//TODO Добавить форму для редактирования аватара

const cn = createCn('profile')

function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user, error } = useAuth()

  const handleFormSubmit = useCallback((data: RequestUserDataUpdate) => {
    dispatch(updateProfile(data))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: 'Настройки обновлены.',
          type: 'success',
        })
      })
      .catch(_ => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось обновить.',
          type: 'error',
        })
      })
  }, [])

  return (
    <div className={cn()}>
      <ProfileForm user={user} error={error} onSubmit={handleFormSubmit} />
    </div>
  )
}

export default withAuth(ProfilePage)
