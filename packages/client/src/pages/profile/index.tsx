import React, { useCallback, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import createCn from '../../utils/create-cn';
import { updateProfile } from '../../store/action-creators/profile';
import type { RequestUserDataUpdate } from '../../types/user';
import ProfileForm from './components/form';
import { useAppDispatch } from '../../components/hooks/store';
import { useAuth } from '../../components/hooks/auth';
import withAuth from '../../components/hoc/withAuth';
import customNotification from '../../components/custom-notification/customNotification';
import './style.css';
import type { Nullable } from '../../types/common';

// TODO Добавить форму для редактирования аватара

const cn = createCn('profile-page');

function ProfilePage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [error, setError] = useState<Nullable<string>>(null);
  const handleFormSubmit = useCallback(
    (data: RequestUserDataUpdate) => {
      setError(null);
      dispatch(updateProfile(data))
        .unwrap()
        .then(() => {
          customNotification({
            message: 'Успешно!',
            description: 'Настройки обновлены.',
            type: 'success',
          });
        })
        .catch((e: string) => {
          setError(e);
          customNotification({
            message: 'Ошибка!',
            description: 'Не удалось обновить.',
            type: 'error',
          });
        });
    },
    [dispatch]
  );

  return (
    <section className={cn('')}>
      <Title level={2} className="title">
        <span className="title-highlight">Настройки</span>
      </Title>
      <ProfileForm user={user} error={error} onSubmit={handleFormSubmit} />
    </section>
  );
}

export default withAuth(ProfilePage);
