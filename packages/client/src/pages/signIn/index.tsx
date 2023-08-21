import { useCallback, useEffect } from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import createCn from '../../utils/create-cn'
import signUpRules from '../signUp/validator'
import './style.css'
import { useAuth } from '../../components/hooks/auth'

type FormData = {
  email: string
  password: string
}

const cn = createCn('sign-in')

function SignInPage(): JSX.Element {
  const navigate = useNavigate()
  const { isLoggedIn, signIn, error: formAlert } = useAuth()
  const handleFormFinish = useCallback(
    (data: FormData): void => {
      signIn({
        email: data.email,
        password: data.password,
      })
    },
    [signIn, navigate]
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
          name="basic"
          onFinish={handleFormFinish}
          layout="vertical"
          autoComplete="off">
          <h1 className={cn('form-title')}>Вход</h1>
          <Form.Item
            className={cn('form-item')}
            label="Email"
            name="email"
            rules={signUpRules.email}>
            <Input />
          </Form.Item>

          <Form.Item
            className={cn('form-item')}
            label="Password"
            name="password"
            rules={signUpRules.password}>
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
            <Link to="/sign-up">
              <Button type="link" block>
                Регистрация
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </section>
  )
}
export default SignInPage
