import { useEffect, useState } from 'react';
import {
  ContainerOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { Row, Col, List, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import getPublicCollectionsService from './service';
import createCn from '../../utils/create-cn';
import './style.css';
import type { Collection } from '../../types/collection';
import Features from './components/features';
import CollectionCarousel from './components/carousel';
import CONSTS from '../../utils/consts';

const { DEMO_VIDEO_POSTER_URL, DEMO_VIDEO_URL } = CONSTS;

const cn = createCn('main-page');

const featuresLeft = [
  {
    icon: <ContainerOutlined className={cn('icon')} />,
    text: 'Создавайте свои или изучайте публичные коллекции слов;',
  },
  {
    icon: <SettingOutlined className={cn('icon')} />,
    text: 'Гибкая настройка тренажера: слова, интервалы, ошибки;',
  },
  {
    icon: <BulbOutlined className={cn('icon')} />,
    text: 'Умный быстрый ввод: не нужно переключать раскладку;',
  },
];

const featuresRight = [
  {
    icon: <ClockCircleOutlined className={cn('icon')} />,
    text: 'Включение таймера для тренировки;',
  },
  {
    icon: <AudioOutlined className={cn('icon')} />,
    text: 'Голосовой ввод и произношение слов;',
  },
  {
    icon: <ThunderboltOutlined className={cn('icon')} />,
    text: 'Развивает навык слепой печати.',
  },
];

// we are not using redux here, because we don't need to store this public endpoint data in the store
// public endpoint data is cached in the browser & server side
function MainPage(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [publicCollections, setPublicCollections] = useState<
    Collection[] | null
  >(null);
  const isLoaded = !loading && publicCollections;

  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
      getPublicCollectionsService().then((collections) => {
        setPublicCollections(collections);
        setLoading(false);
      });
    }
  }, [isLoaded]);

  return (
    <section className={cn('')}>
      <Title level={2}>
        Learn words the way
        <span className="title-highlight">you like it</span>
      </Title>
      <Title level={5}>тренажер изучения слов playword</Title>
      <Row justify="center" align="middle" gutter={10}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}>
          <List
            size="large"
            dataSource={featuresLeft}
            split={false}
            renderItem={(item) => (
              <List.Item>
                <Space direction="horizontal">
                  {item.icon}
                  {item.text}
                </Space>
              </List.Item>
            )}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}>
          <List
            size="large"
            split={false}
            dataSource={featuresRight}
            renderItem={(item) => (
              <List.Item>
                <Space direction="horizontal">
                  {item.icon}
                  {item.text}
                </Space>
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <Title level={2} className={cn('title')}>
        Как это работает?
      </Title>
      <Features />
      <Row justify="center" align="middle" className={cn('demo-box')}>
        <Col>
          <video
            controls
            preload="none"
            poster={DEMO_VIDEO_POSTER_URL}
            className={cn('demo-video')}>
            <track kind="captions" />
            <source src={DEMO_VIDEO_URL} type="video/webm" />
            Ваш браузер не поддерживает video тег.
          </video>
        </Col>
      </Row>
      {isLoaded && publicCollections?.length > 0 && (
        <>
          <Title level={2} className={cn('title')}>
            Изучай то, что интересно
          </Title>
          <CollectionCarousel collections={publicCollections} />
        </>
      )}
    </section>
  );
}

export default MainPage;
