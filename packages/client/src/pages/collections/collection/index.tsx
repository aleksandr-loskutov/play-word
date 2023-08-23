import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Avatar,
  Row,
  Col,
  Space,
  Typography,
  message,
  Tooltip,
  Popconfirm,
} from 'antd'
import './styles.css'
import { useAppDispatch, useAppSelector } from '../../../components/hooks/store'
import Layout from '../../../components/layout'
import createCn from '../../../utils/create-cn'
import AddWordsModal from './modal'
import { WordForCollection } from '../../../types/collection'
import { addWordsToCollection } from '../../../store/action-creators/word'
import {
  addCollectionWordsForTraining,
  removeCollectionWordsFromTraining,
} from '../../../store/action-creators/training'
import { deleteCollection } from '../../../store/action-creators/collection'
import Meta from 'antd/lib/card/Meta'
import {
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import WithAuth from '../../../components/hoc/withAuth'
import { customNotification } from '../../../components/custom-notification/customNotification'
import PageLoader from '../../../components/page-loader'

const cn = createCn('collection-page')
const { Title } = Typography

const CollectionPage: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { collections, isLoading } = useAppSelector(state => state.collections)
  const collection = collections.find(c => c.id === Number(id))

  const [showAddWordsModal, setShowAddWordsModal] = useState(false)

  const handleAddWordsButton = () => {
    setShowAddWordsModal(true)
  }

  const handleSubmitAddWords = (words: WordForCollection[]) => {
    setShowAddWordsModal(false)
    if (!collection || !words || words.length === 0) return
    dispatch(addWordsToCollection({ collectionId: collection.id, words }))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: `Слова добавлены в коллекцию`,
          type: 'success',
        })
      })
      .catch(_ => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось добавить слова в коллекцию ',
          type: 'error',
        })
      })
  }

  const handleAddWordsToTraining = () => {
    if (
      !collection ||
      !collection.words.length ||
      collection.words.length === 0
    )
      return
    dispatch(addCollectionWordsForTraining(collection.id))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: 'Слова коллекции добавлены в тренировку',
          type: 'success',
        })
      })
      .catch((error: any) => {
        customNotification({
          message: 'Ошибка!',
          description:
            error.message || 'Не удалось добавить слова в тренировку',
          type: 'error',
        })
      })
  }

  const handleRemoveWordsFromTraining = () => {
    if (
      !collection ||
      !collection.words.length ||
      collection.words.length === 0
    )
      return
    dispatch(removeCollectionWordsFromTraining(collection.id))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: 'Слова коллекции удалены из тренировки',
          type: 'success',
        })
      })
      .catch(_ => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось удалить слова из тренировки',
          type: 'error',
        })
      })
  }

  const handleDeleteCollection = () => {
    if (!collection) return
    handleRemoveWordsFromTraining()
    dispatch(deleteCollection(collection.id))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: 'Коллекция удалена',
          type: 'success',
        })
        navigate('/collections')
      })
      .catch(_ => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось удалить коллекцию',
          type: 'error',
        })
      })
  }

  const handleCancel = () => {
    setShowAddWordsModal(false)
  }

  return isLoading ? (
    <PageLoader />
  ) : collections.length > 0 && collection ? (
    <section className={cn('')}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2} className={'title'}>
            {collection.name}
          </Title>
        </Col>

        <Col span={24}>
          <Card
            className={cn('card')}
            cover={
              <img
                alt={collection.name}
                src={
                  collection.image ||
                  'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                }
              />
            }
            actions={[
              <Tooltip title="Добавить / Изменить слова">
                <EditOutlined key="edit" onClick={handleAddWordsButton} />
              </Tooltip>,
              <Popconfirm
                title="Начать изучать слова этой коллекции?"
                description={'В тренировку будут добавлены все слова коллекции'}
                okText="Да"
                cancelText="Нет"
                onConfirm={handleAddWordsToTraining}
                zIndex={2000}>
                <PlusOutlined key="add-to-training" />
              </Popconfirm>,
              <Popconfirm
                title="Убрать все слова коллекции из тренировки?"
                description={
                  'Прогресс слов коллекции будет удален из тренировок'
                }
                okText="Да"
                cancelText="Нет"
                onConfirm={handleRemoveWordsFromTraining}
                zIndex={2000}>
                <MinusOutlined key="remove-from-training" />
              </Popconfirm>,
              <Popconfirm
                title="Удалить коллекцию?"
                description={
                  'Все слова коллекции также будут удалены из тренировок'
                }
                okText="Да"
                cancelText="Нет"
                onConfirm={handleDeleteCollection}
                zIndex={2000}>
                <DeleteOutlined key="delete" />
              </Popconfirm>,
            ]}>
            <Meta
              title={collection.name}
              description={collection.description || 'No description provided'}
            />
          </Card>
        </Col>
        <Col span={24}>
          <AddWordsModal
            onSubmit={handleSubmitAddWords}
            visible={showAddWordsModal}
            onClose={handleCancel}
            initialWords={collection.words}
          />
        </Col>
      </Row>
    </section>
  ) : (
    <Title className={'title'}>Не удалось загрузить коллекцию</Title>
  )
}

export default WithAuth(CollectionPage)
