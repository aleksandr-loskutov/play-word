import React, { useCallback } from 'react'
import { Form, Input, Button, Alert } from 'antd'
import { useNavigate } from 'react-router'
import { Rule } from 'antd/lib/form'
import createCn from '../../utils/create-cn'
import signUpRules from './validator'
import './style.css'
import { useAppDispatch } from '../../components/hooks/store'
import { useAuth } from '../../components/hooks/auth'
import MainLayout from '../../components/layout'

type FormData = {
  email: string
  name: string
  password: string
  passwordRepeat: string
}

const cn = createCn('sign-up')

function SignUpPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, signUp, error: formAlert } = useAuth()
  const onLoginClick = useCallback((): void => {
    navigate('/sign-in')
  }, [])
  const handleSubmit = useCallback((data: FormData): void => {
    console.log('data', data)
    dispatch(signUp(data))
  }, [])
  if (user) {
    navigate('/')
  }

  return (
    <MainLayout>
      <section className={cn()}>
        <div className={cn('box')}>
          <Form
            className={cn('form')}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <h1 className={cn('form-title')}>Регистрация</h1>
            <Form.Item
              className={cn('form-item')}
              label="Почта"
              name="email"
              rules={signUpRules.email as Rule[]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className={cn('form-item')}
              label="Имя"
              name="name"
              rules={signUpRules.firstName}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className={cn('form-item')}
              name="password"
              label="Пароль"
              rules={signUpRules.password}
              hasFeedback
            >
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
              ]}
            >
              <Input.Password />
            </Form.Item>
            {formAlert && (
              <Alert
                message={formAlert}
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
              <Button
                type="link"
                htmlType="button"
                block
                onClick={onLoginClick}
              >
                Войти
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </MainLayout>
  )
}

export default SignUpPage
