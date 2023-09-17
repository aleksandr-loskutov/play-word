import { useState, useMemo } from 'react';
import { Button, Typography, Card, Row, Col, Avatar, Space } from 'antd';
import './styles.css';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import createCn from '../../utils/create-cn';
import { useAppDispatch, useAppSelector } from '../../components/hooks/store';
import { createCollection } from '../../store/action-creators/collection';
import PageLoader from '../../components/page-loader';
import WithAuth from '../../components/hoc/withAuth';
import { AvatarSrcs, Collection } from '../../types/collection';
import customNotification from '../../components/custom-notification/customNotification';
import CollectionCreateForm from './modal';
import createImageFromInitials from '../../utils/image-from-string';

const { Title } = Typography;
const cn = createCn('collections-page');

function CollectionsPage(): JSX.Element {
  const { collections, isLoading } = useAppSelector(
    (state) => state.collections
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const onCreate = (values: any) => {
    setOpen(false);
    dispatch(createCollection(values))
      .unwrap()
      .then((createdCollection: void | Collection) => {
        if (createdCollection) {
          customNotification({
            message: 'Успешно!',
            description: 'Добавили коллекцию',
            type: 'success',
          });
          navigate(`/collections/${createdCollection.id}`);
        }
      })
      .catch(() => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось создать коллекцию',
          type: 'error',
        });
      });
  };

  const avatarSrcs = useMemo<AvatarSrcs>(
    () =>
      collections.reduce((acc: AvatarSrcs, collection) => {
        acc[collection.id] = createImageFromInitials(collection.name, 100);
        return acc;
      }, {}),
    [collections]
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (collections.length > 0) {
    return (
      <section className={cn('')}>
        <Title level={2} className="title">
          Коллекции слов
        </Title>
        <Space direction="vertical" align="center">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}>
            Добавить коллекцию
          </Button>

          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <Row gutter={[10, 15]} justify="center">
            {collections.map((collection) => (
              <Col
                key={collection.id}
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}>
                <Link
                  to={`/collections/${collection.id}`}
                  style={{ textDecoration: 'none' }}>
                  <div className={cn('box')}>
                    <Card className={cn('card')} bordered={false}>
                      <Space direction="vertical" align="center" size={1}>
                        <span className={cn('card-name')}>
                          {collection.name}
                        </span>
                        <Avatar
                          shape="square"
                          className={cn('card-image')}
                          src={avatarSrcs[collection.id]}
                        />
                        <span className={cn('card-description')}>
                          {collection.description || 'нет описания'}
                        </span>
                        <span className={cn('card-words-count')}>
                          Слов: {collection.words.length || 0}
                        </span>
                      </Space>
                    </Card>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Space>
      </section>
    );
  }

  return <Title className="title">Нет коллекций</Title>;
}

export default WithAuth(CollectionsPage);
