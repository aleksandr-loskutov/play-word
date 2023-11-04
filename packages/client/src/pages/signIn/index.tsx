import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import createCn from '../../utils/create-cn';
import signUpRules from '../signUp/validator';
import './style.css';
import { useAuth } from '../../components/hooks/auth';
import customNotification from '../../components/custom-notification/customNotification';
import type { Nullable } from '../../types/common';

type FormData = {
  email: string;
  password: string;
};

const cn = createCn('sign-in');

function SignInPage(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, signIn } = useAuth();
  const [error, setError] = useState<Nullable<string>>(null);
  const handleFormFinish = useCallback(
    (data: FormData): void => {
      setError(null);
      signIn({
        email: data.email,
        password: data.password,
      })
        .unwrap()
        .then(() => {
          customNotification({
            message: 'Успешно!',
            description: 'Вошли в аккаунт.',
            type: 'success',
          });
        })
        .catch((e: string) => {
          setError(e);
        });
    },
    [signIn]
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  return (
    <section className={cn()}>
      <div className={cn('box')}>
        <Form
          className={cn('form')}
          name="basic"
          onFinish={handleFormFinish}
          layout="vertical"
          autoComplete="off">
          <h1 className={cn('form-title')}>
            <span className="title-highlight">Вход</span>
          </h1>
          <Form.Item
            className={cn('form-item')}
            label="Почта"
            required
            name="email"
            rules={signUpRules.email}>
            <Input />
          </Form.Item>

          <Form.Item
            className={cn('form-item')}
            label="Пароль"
            required
            name="password"
            rules={signUpRules.password}>
            <Input.Password />
          </Form.Item>

          {error && (
            <Alert
              message={`Ошибка: ${error}`}
              type="error"
              className={cn('form-alert')}
            />
          )}

          <Form.Item className={cn('form-item')}>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>

          <Form.Item className={cn('form-item')}>
            <Link to="/sign-up">
              <Button type="link" block>
                Регистрация
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
export default SignInPage;
