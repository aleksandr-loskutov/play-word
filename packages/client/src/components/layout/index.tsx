import React, { useCallback, useMemo } from 'react'
import { Avatar, Badge, Col, Layout, Menu, Row } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/store'
import { useAuth } from '../hooks/auth'
import createCn from '../../utils/create-cn'
import { signOut } from '../../store/action-creators/auth'
import './style.css'
import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  EllipsisOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { getWordsReadyForTraining } from '../../pages/train/utils'

const { Header, Content, Footer } = Layout
const cn = createCn('layout')

type LayoutProps = {
  children: React.ReactNode
}

function MainLayout({ children }: LayoutProps): JSX.Element {
  const { user, isLoggedIn, signOut, training } = useAuth()

  const handleLogoutButtonClick = useCallback(() => {
    signOut()
  }, [])

  const wordsForTrainingCount = useMemo(() => {
    return getWordsReadyForTraining(training)
  }, [training])

  const location = useLocation()

  const getActiveMenuKey = useCallback(() => {
    switch (location.pathname) {
      case '/':
        return 'home'
      case '/train':
        return 'train'
      case '/collections':
        return 'collections'
      case '/profile':
        return isLoggedIn ? 'profile' : 'signin'
      default:
        return ''
    }
  }, [location, isLoggedIn])

  const items = useMemo(() => {
    return [
      {
        label: (
          <Link to="/">
            <HomeOutlined /> PlayWord
          </Link>
        ),
        key: 'home',
      },
      {
        label: (
          <Link to="/train">
            <BookOutlined /> Тренировка
            {isLoggedIn && (
              <Badge
                count={wordsForTrainingCount}
                className={cn('badge')}
                style={{
                  background:
                    'linear-gradient(0deg, #1b8aab, #45f3ff, #1b8aab)',
                  color: 'black',
                  bottom: '11px',
                  right: '4px',
                }}></Badge>
            )}
          </Link>
        ),
        key: 'train',
      },
      {
        label: (
          <Link to="/collections">
            <AppstoreOutlined /> Коллекции
          </Link>
        ),
        key: 'collections',
      },
      {
        label: (
          <>
            <UserOutlined /> {isLoggedIn ? user?.name : 'Вход'}
          </>
        ),
        key: 'user',
        children: isLoggedIn
          ? [
              {
                label: (
                  <Link to="/profile">
                    <SettingOutlined /> Профиль
                  </Link>
                ),
                key: 'profile',
              },
              {
                label: (
                  <Link to="#" onClick={handleLogoutButtonClick}>
                    <LogoutOutlined /> Выйти
                  </Link>
                ),
                key: 'logout',
              },
            ]
          : [
              {
                label: (
                  <Link to="/sign-in">
                    <LoginOutlined /> Войти
                  </Link>
                ),
                key: 'signin',
              },
              {
                label: (
                  <Link to="/sign-up">
                    <UserAddOutlined /> Регистрация
                  </Link>
                ),
                key: 'signup',
              },
            ],
      },
    ]
  }, [isLoggedIn, training])

  return (
    <Layout className={cn('')}>
      <div className={cn('page-container')}>
        <Header className={cn('header')} style={{ paddingInline: 0 }}>
          <div className={cn('menu-container')}>
            <Menu
              className={cn('menu')}
              mode="horizontal"
              items={items}
              selectedKeys={[getActiveMenuKey()]}
            />
          </div>
        </Header>
        <Content className={cn('content-container')}>{children}</Content>
        <Footer style={{ textAlign: 'center' }} className={cn('footer footer')}>
          <Row
            justify="space-around"
            align="middle"
            className="footer-container">
            <Col span={3}>PlayWord.ru</Col>
            <Col span={2}>FAQ</Col>
            <Col span={3}>О проекте</Col>
          </Row>
        </Footer>
      </div>
    </Layout>
  )
}

export default MainLayout
