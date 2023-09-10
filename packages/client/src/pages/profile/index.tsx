import React, { useCallback, ChangeEvent, useState } from 'react';
import createCn from '../../utils/create-cn';
import { updateProfile } from '../../store/action-creators/profile';
import { RequestUserData, RequestUserDataUpdate } from '../../types/user';
import ProfileForm from './components/form';
import Title from 'antd/lib/typography/Title';
import { useAppDispatch } from '../../components/hooks/store';
import { useAuth } from '../../components/hooks/auth';
import withAuth from '../../components/hoc/withAuth';
import { customNotification } from '../../components/custom-notification/customNotification';
import { Col, Row } from 'antd';
import './style.css';
import { Nullable } from '../../types/common';

//TODO Добавить форму для редактирования аватара

const cn = createCn('profile-page');

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [error, setError] = useState<Nullable<string>>(null);
  const handleFormSubmit = useCallback(
    (data: RequestUserDataUpdate) => {
      setError(null);
      dispatch(updateProfile(data))
        .unwrap()
        .then((_) => {
          customNotification({
            message: 'Успешно!',
            description: 'Настройки обновлены.',
            type: 'success',
          });
        })
        .catch((error: string) => {
          setError(error);
          customNotification({
            message: 'Ошибка!',
            description: 'Не удалось обновить.',
            type: 'error',
          });
        });
    },
    [dispatch],
  );

  return (
    <section className={cn('')}>
      <Title level={2} className={'title'}>
        Профиль
      </Title>
      <ProfileForm user={user} error={error} onSubmit={handleFormSubmit} />
    </section>
  );
};

export default withAuth(ProfilePage);
