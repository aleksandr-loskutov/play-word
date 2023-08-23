import React, { useCallback, ChangeEvent } from 'react'
import createCn from '../../utils/create-cn'
import { updateProfile } from '../../store/action-creators/profile'
import { RequestUserData, RequestUserDataUpdate } from '../../types/user'
import ProfileForm from './components/form'
import Title from 'antd/lib/typography/Title'
import { useAppDispatch } from '../../components/hooks/store'
import { useAuth } from '../../components/hooks/auth'
import withAuth from '../../components/hoc/withAuth'
import { customNotification } from '../../components/custom-notification/customNotification'
import { Col, Row } from 'antd'
import './style.css'

//TODO Добавить форму для редактирования аватара

const cn = createCn('profile-page')

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
    <section className={cn('')}>
      <Title level={2} className={'title'}>
        Профиль
      </Title>
      <Row justify="center">
        <Col span={12}>
          <ProfileForm user={user} error={error} onSubmit={handleFormSubmit} />
        </Col>
      </Row>
    </section>
  )
}

export default withAuth(ProfilePage)
