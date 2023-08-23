import React, { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Modal,
  Input,
  Checkbox,
  Form,
  Radio,
  message,
  notification,
  Space,
} from 'antd'
import './styles.css'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAppDispatch, useAppSelector } from '../../components/hooks/store'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useAuth } from '../../components/hooks/auth'
import {
  createCollection,
  getUserCollections,
} from '../../store/action-creators/collection'
import PageLoader from '../../components/page-loader'
import withAuth from '../../components/hoc/withAuth'
import Paragraph from 'antd/lib/typography/Paragraph'
import WithAuth from '../../components/hoc/withAuth'
import { Collection } from '../../types/collection'
import { Response } from '../../types/api'
import CollectionCreateForm from './collection/modal/collectionCreateForm'
import { customNotification } from '../../components/custom-notification/customNotification'
import { PlusOutlined } from '@ant-design/icons'

const { Title } = Typography
const cn = createCn('collections-page')

function CollectionsPage() {
  const { collections, isLoading } = useAppSelector(state => state.collections)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [open, setOpen] = useState(false)
  const onCreate = (values: any) => {
    setOpen(false)
    dispatch(createCollection(values))
      .unwrap()
      .then((createdCollection: Response<Collection> | undefined) => {
        if (createdCollection) {
          customNotification({
            message: 'Успешно!',
            description: 'Добавили коллекцию',
            type: 'success',
          })
          navigate(`/collections/${createdCollection.id}`)
        }
      })
      .catch((error: any) => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось создать коллекцию',
          type: 'error',
        })
      })
  }

  return isLoading ? (
    <PageLoader />
  ) : collections.length > 0 ? (
    <section className={cn('')}>
      <Title level={2} className={'title'}>
        Коллекции слов
      </Title>
      <Space direction={'vertical'} align={'center'}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true)
          }}>
          Добавить коллекцию
        </Button>

        <CollectionCreateForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false)
          }}
        />
        <Row gutter={[10, 15]}>
          {collections.map(collection => (
            <Col key={collection.id} span={30}>
              <Link
                to={`/collections/${collection.id}`}
                style={{ textDecoration: 'none' }}>
                <div className={cn('box')}>
                  <Card className={cn('card')} bordered={false}>
                    <h4 className={cn('card-title')}>{collection.name}</h4>
                    <Avatar
                      className={cn('card-image')}
                      src={collection.image}
                    />
                    <p className={cn('card-description')}>
                      {collection.description || 'No description'}
                    </p>
                    <p className={cn('card-words-count')}>
                      Words count: {collection.wordsCount || 0}
                    </p>
                    <p className={cn('card-author')}>
                      Author: {collection.author || 'no author'}
                    </p>
                  </Card>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Space>
    </section>
  ) : (
    <Title className={'title'}>Нет коллекций</Title>
  )
}

export default WithAuth(CollectionsPage)
