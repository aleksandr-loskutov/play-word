import { useCallback, ChangeEvent } from 'react'
import createCn from '../../utils/create-cn'
import {
  updateProfile,
  updateProfileAvatar,
} from '../../store/action-creators/profile'
import Layout from '../../components/layout'
import { RequestUserData } from '../../types/user'
// import ProfileAvatar from './components/avatar'
import ProfileForm from './components/form'
import './style.css'
import { useAppDispatch } from '../../components/hooks/store'
import { useAuth } from '../../components/hooks/auth'
import withAuth from '../../components/hoc/withAuth'

//TODO Добавить форму для редактирования аватара

const cn = createCn('profile')

function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user, error } = useAuth()

  const handleFormSubmit = useCallback((data: RequestUserData) => {
    console.log('submit', data)
    dispatch(updateProfile(data))
  }, [])

  const handleAvatarChange = useCallback((event: ChangeEvent) => {
    const input = event.target as HTMLInputElement

    if (input && input.files?.length) {
      const formData = new FormData()

      formData.append('avatar', input.files[0])

      dispatch(updateProfileAvatar(formData))
    }
  }, [])

  return (
    <Layout>
      <div className={cn()}>
        {/*<ProfileAvatar*/}
        {/*  className={cn('avatar')}*/}
        {/*  onChange={handleAvatarChange}*/}
        {/*  user={user}*/}
        {/*/>*/}
        <ProfileForm
          className={cn('form')}
          user={user}
          error={error}
          onSubmit={handleFormSubmit}
        />
      </div>
    </Layout>
  )
}

export default withAuth(ProfilePage)
