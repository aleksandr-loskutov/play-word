import { useCallback, useEffect } from 'react'
import { Alert, Button, Checkbox, Form, Input, Layout } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import createCn from '../../utils/create-cn'
import signUpRules from '../signUp/validator'
import './style.css'
import { useAppDispatch } from '../../components/hooks/store'
import { useAuth } from '../../components/hooks/auth'
import MainLayout from '../../components/layout'
import { Content } from 'antd/es/layout/layout'

type FormData = {
  email: string
  password: string
}

const cn = createCn('sign-in')

function SignInPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, signIn, error: formAlert } = useAuth()
  const handleFormFinish = useCallback((data: FormData): void => {
    dispatch(
      signIn({
        email: data.email,
        password: data.password,
      })
    )
  }, [])

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  return (
    <MainLayout>
      <section className={cn()}>
        <div className={cn('box')}>
          <Form
            className={cn('form')}
            name="basic"
            onFinish={handleFormFinish}
            layout="vertical"
            autoComplete="off"
          >
            <h1 className={cn('form-title')}>Вход</h1>
            <Form.Item
              className={cn('form-item')}
              label="Email"
              name="email"
              rules={signUpRules.email}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className={cn('form-item')}
              label="Password"
              name="password"
              rules={signUpRules.password}
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
                Войти
              </Button>
            </Form.Item>

            <Form.Item className={cn('form-item')}>
              <Link to="/sign-up">Регистрация</Link>
            </Form.Item>
          </Form>
        </div>
      </section>
    </MainLayout>
  )
}
export default SignInPage
