import React, { useCallback, useEffect, useState } from 'react'
import { Form, Input, Button, Alert } from 'antd'
import { useNavigate } from 'react-router'
import { Rule } from 'antd/lib/form'
import createCn from '../../utils/create-cn'
import signUpRules from './validator'
import './style.css'
import { useAuth } from '../../components/hooks/auth'
import { Link } from 'react-router-dom'
import { Nullable } from '../../types/common'
import { customNotification } from '../../components/custom-notification/customNotification'

type FormData = {
  email: string
  name: string
  password: string
  passwordRepeat: string
}

const cn = createCn('sign-up')

function SignUpPage(): JSX.Element {
  const navigate = useNavigate()
  const { isLoggedIn, signUp, error: formAlert } = useAuth()
  const [error, setError] = useState<Nullable<string>>(null)
  const handleSubmit = useCallback(
    (data: FormData): void => {
      setError(null)
      signUp(data)
        .unwrap()
        .then(_ => {
          customNotification({
            message: 'Успешно!',
            description: 'Регистрация прошла успешно.',
            type: 'success',
          })
        })
        .catch((error: string) => {
          setError(error)
        })
    },
    [signUp, formAlert]
  )

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])

  return (
    <section className={cn()}>
      <div className={cn('box')}>
        <Form
          className={cn('form')}
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}>
          <h1 className={cn('form-title')}>Регистрация</h1>
          <Form.Item
            className={cn('form-item')}
            label="Почта"
            name="email"
            rules={signUpRules.email as Rule[]}>
            <Input />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Имя"
            name="name"
            rules={signUpRules.firstName}>
            <Input />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            name="password"
            label="Пароль"
            rules={signUpRules.password}
            hasFeedback>
            <Input.Password />
          </Form.Item>

          <Form.Item
            className={cn('form-item')}
            name="passwordRepeat"
            label="Пароль (еще раз)"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Введите пароль еще раз',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Пароли не совпадают'))
                },
              }),
            ]}>
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
              Зарегистрироваться
            </Button>
          </Form.Item>

          <Form.Item className={cn('form-item')}>
            <Link to="/sign-in">
              <Button type="link" block>
                Войти
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </section>
  )
}

export default SignUpPage
