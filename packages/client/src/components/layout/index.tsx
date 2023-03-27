import React, { useCallback, useMemo, useState } from 'react'
import { Badge, Layout, Menu, theme } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/store'
import { useAuth } from '../hooks/auth'
import createCn from '../../utils/create-cn'
import { updateTheme } from '../../store/action-creators/profile'
import { signOut } from '../../store/action-creators/auth'
import './style.css'
import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  EllipsisOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { getWordsReadyForTraining } from '../../utils/training'

type LayoutProps = {
  children: React.ReactNode
}

const { Header, Content, Footer } = Layout

const cn = createCn('layout')

function MainLayout({ children }: LayoutProps): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isLoggedIn, training } = useAuth()

  const currentTheme = user?.theme || 'default'
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleLogoutButtonClick = useCallback(() => {
    dispatch(signOut())
  }, [])

  const wordsForTraining = useCallback(() => {
    return getWordsReadyForTraining(training)
  }, [training])

  const homeItem = {
    label: (
      <Link to="/">
        <HomeOutlined /> Главная
      </Link>
    ),
    key: 'home',
  }

  const trainItem = {
    label: (
      <Link to="/train">
        <BookOutlined /> Тренировка слов
      </Link>
    ),
    key: 'train',
  }

  const collectionsItem = {
    label: (
      <Link to="/collections">
        <AppstoreOutlined /> Коллекции слов
      </Link>
    ),
    key: 'collections',
  }
  const authSubMenu = {
    label: (
      <Link to="/profile" style={{ color: 'white' }}>
        <UserOutlined /> {isLoggedIn ? user?.name : 'Авторизация'}
      </Link>
    ),
    key: 'submenu',
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
          { label: <Link to="/sign-in">Вход</Link>, key: 'signin' },
          { label: <Link to="/sign-up">Регистрация</Link>, key: 'signup' },
        ],
  }

  const items = useMemo(() => {
    return [
      {
        label: (
          <Link to="/">
            <HomeOutlined /> Главная
          </Link>
        ),
        key: 'home',
      },
      {
        label: (
          <Link to="/train">
            <Badge
              count={wordsForTraining()}
              style={{ backgroundColor: '#52c41a' }}>
              <BookOutlined /> Тренировка
            </Badge>
          </Link>
        ),
        key: 'train',
      },
      collectionsItem,
      authSubMenu,
    ]
  }, [isLoggedIn, training])

  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const handleThemeChange = useCallback((theme: string) => {
    dispatch(updateTheme(theme))
  }, [])

  return (
    <Layout className={cn()}>
      <Header style={{ backgroundColor: 'black' }}>
        <div className="logo" />
        <div className={cn('menu-container')}>
          <div className={cn('menu-content')}>
            <Menu
              mode="horizontal"
              style={{ flex: 'auto', minWidth: 0 }}
              overflowedIndicator={<UserOutlined />}
              items={items}
            />
          </div>
        </div>
      </Header>
      <Content className={cn('content-container')}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>PlayWord</Footer>
    </Layout>
  )
}

export default MainLayout
