import React, { useCallback, useMemo, useState } from 'react'
import { Avatar, Breadcrumb, Layout, Menu, Select, theme } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/store'
import { useAuth } from '../hooks/auth'
import createCn from '../../utils/create-cn'
import { themeList } from '../../theme'
import { updateTheme } from '../../store/action-creators/profile'
import { signOut } from '../../store/action-creators/auth'
import CONSTS from '../../utils/consts'
import './style.css'

type LayoutProps = {
  children: React.ReactNode
}

const { Header, Content, Footer, Sider } = Layout
const { defaultAlgorithm, darkAlgorithm } = theme

const cn = createCn('layout')

function MainLayout({ children }: LayoutProps): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const currentTheme = user?.theme || 'default'
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleLogoutButtonClick = useCallback(() => {
    dispatch(signOut())
  }, [])

  const items = useMemo(
    () => [
      { label: <Link to="/">Главная</Link>, key: 'home' },
      { label: <Link to="/train">Тренировка</Link>, key: 'train' },
      { label: <Link to="/collections">Коллекции</Link>, key: 'collections' },
      { label: <Link to="/sign-in">Вход</Link>, key: 'signin' },
      { label: <Link to="/sign-up">Регистрация</Link>, key: 'signup' },
      { label: <Link to="/profile">Профиль</Link>, key: 'profile' },
      { label: <Link to="/about">О проекте</Link>, key: 'about' },
      {
        label: (
          <Link to="#" onClick={handleLogoutButtonClick}>
            Выйти
          </Link>
        ),
        key: 'logout',
      },
    ],
    []
  )

  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const handleThemeChange = useCallback((theme: string) => {
    dispatch(updateTheme(theme))
  }, [])

  return (
    <Layout className={cn()}>
      <Header>
        <div className="logo" />
        <Menu mode="horizontal" defaultSelectedKeys={['home']} items={items} />
      </Header>
      <Content className={cn('content-container')}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>PlayWord</Footer>
    </Layout>
  )
}

export default MainLayout
