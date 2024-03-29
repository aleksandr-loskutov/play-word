import React, { useCallback, useMemo } from 'react';
import { Badge, Col, Layout, Menu, Row } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  BookOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useAuth } from '../hooks/auth';
import createCn from '../../utils/create-cn';
import './style.css';

import { getWordsReadyForTraining } from '../../pages/train/utils';
import ReloadPrompt from '../reload-prompt';

const { Header, Content, Footer } = Layout;
const cn = createCn('layout');

type LayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: LayoutProps): JSX.Element {
  const { user, isLoggedIn, signOut, training } = useAuth();

  const handleLogoutButtonClick = useCallback(() => {
    signOut();
  }, []);

  const wordsForTrainingCount = useMemo(
    () => getWordsReadyForTraining(training),
    [training]
  );

  const location = useLocation();

  const getActiveMenuKey = useCallback(() => {
    switch (location.pathname) {
      case '/':
        return 'home';
      case '/train':
        return 'train';
      case '/collections':
        return 'collections';
      case '/profile':
        return isLoggedIn ? 'profile' : 'signin';
      default:
        return '';
    }
  }, [location, isLoggedIn]);

  const items = useMemo(
    () => [
      {
        label: (
          <Link to="/">
            <div className={cn('logo-container')}>
              <img
                src="/img/logo/logo-transparent.svg"
                alt="Logo"
                className={cn('logo')}
              />
            </div>
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
                }}
              />
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
                    <SettingOutlined /> Настройки
                  </Link>
                ),
                key: 'profile',
              },
              {
                label: (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
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
    ],
    [isLoggedIn, training]
  );

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
        <Content className={cn('content-container')}>
          <ReloadPrompt />
          {children}
        </Content>
        <Footer className={cn('footer footer')}>
          <Row
            justify="space-around"
            align="middle"
            className="footer-container"
            gutter={[10, 10]}>
            <Col>PlayWord.ru</Col>
            <Col>FAQ</Col>
            <Col>О проекте</Col>
          </Row>
        </Footer>
      </div>
    </Layout>
  );
}

export default MainLayout;
