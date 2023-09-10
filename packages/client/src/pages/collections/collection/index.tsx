import React, { useMemo, useState } from 'react'
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
  Input,
  Modal,
} from 'antd'
import './styles.css'
import { useAppDispatch, useAppSelector } from '../../../components/hooks/store'
import Layout from '../../../components/layout'
import createCn from '../../../utils/create-cn'
import AddWordsModal from './modal'
import {
  AvatarSrcs,
  Collection,
  RequestCollectionUpdate,
  WordForCollection,
} from '../../../types/collection'
import { updateWordsInCollection } from '../../../store/action-creators/word'
import {
  addCollectionWordsForTraining,
  removeCollectionWordsFromTraining,
} from '../../../store/action-creators/training'
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from '../../../store/action-creators/collection'
import Meta from 'antd/lib/card/Meta'
import Icon, {
  DeleteOutlined,
  DeleteTwoTone,
  EditOutlined,
  EditTwoTone,
  MinusOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons'
import WithAuth from '../../../components/hoc/withAuth'
import { customNotification } from '../../../components/custom-notification/customNotification'
import PageLoader from '../../../components/page-loader'
import { createImageFromInitials } from '../../../utils/image-from-string'
import { useAuth } from '../../../components/hooks/auth'

const cn = createCn('collection-page')
const { Title } = Typography
const iconStyle = { fontSize: '24px' }

const CollectionPage: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [collectionEditModalOpen, setCollectionEditModalOpen] = useState(false)
  const [editedCollectionName, setEditedCollectionName] = useState<string>('')
  const { collections, isLoading } = useAppSelector(state => state.collections)
  const collection = collections.find(c => c.id === Number(id))

  const [showAddWordsModal, setShowAddWordsModal] = useState(false)

  const handleAddWordsButton = () => {
    setShowAddWordsModal(true)
  }
  const handleTitleClick = () => {
    if (collection) {
      setEditedCollectionName(collection.name)
    }
    setCollectionEditModalOpen(true)
  }

  const handleSubmitAddWords = (words: WordForCollection[]) => {
    setShowAddWordsModal(false)
    if (!collection || !words || words.length === 0) return
    dispatch(updateWordsInCollection({ collectionId: collection.id, words }))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: `Коллекция обновлена`,
          type: 'success',
        })
      })
      .catch((e: any) => {
        customNotification({
          message: 'Ошибка!',
          description: `${e}`,
          type: 'error',
        })
      })
  }

  const handleUpdateName = () => {
    handleSubmitCollectionEdit({ id: Number(id), name: editedCollectionName })
  }

  const handleSubmitCollectionEdit = (
    dataToUpdate: RequestCollectionUpdate
  ) => {
    handleCloseEditModal()
    if (
      !collection ||
      !dataToUpdate.id ||
      dataToUpdate.name === '' ||
      dataToUpdate.name === collection.name
    )
      return
    dispatch(updateCollection(dataToUpdate))
      .unwrap()
      .then(_ => {
        customNotification({
          message: 'Успешно!',
          description: 'Обновили коллекцию',
          type: 'success',
        })
      })
      .catch(_ => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось обновить коллекцию',
          type: 'error',
        })
      })
  }

  const handleCloseEditModal = () => {
    setCollectionEditModalOpen(false)
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

  const isUserOwnsCollection = useMemo((): boolean => {
    return collection?.userId === user?.id
  }, [collection, user])

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
  const avatarSrc = useMemo(() => {
    if (collection?.name) {
      return createImageFromInitials(350, collection.name)
    }
  }, [collection])

  return isLoading ? (
    <PageLoader />
  ) : collections.length > 0 && collection ? (
    <section className={cn('')}>
      <Row>
        <Col span={24}>
          <Tooltip title="изменить название">
            <Title
              level={2}
              className={cn('title title')}
              onClick={() => handleTitleClick()}>
              {collection.name}
            </Title>
          </Tooltip>
          <Modal
            title="Название коллекции"
            open={collectionEditModalOpen}
            onCancel={handleCloseEditModal}
            onOk={handleUpdateName}
            cancelText={'отмена'}
            okText={'сохранить'}>
            <Input
              value={editedCollectionName}
              onChange={e => setEditedCollectionName(e.target.value)}
            />
          </Modal>
        </Col>
        <Col span={24}>
          <Card
            className={cn('card')}
            cover={
              <img
                alt={collection.name}
                src={avatarSrc || ''}
                className={cn('card-image')}
                style={{ borderRadius: '10px' }}
              />
            }
            actions={[
              isUserOwnsCollection ? (
                <Tooltip title="Добавить / Изменить слова">
                  <EditOutlined
                    key="edit"
                    onClick={handleAddWordsButton}
                    style={iconStyle}
                  />
                </Tooltip>
              ) : null,
              <Popconfirm
                title="Начать изучать слова этой коллекции?"
                description={'В тренировку будут добавлены все слова коллекции'}
                okText="Да"
                cancelText="Нет"
                onConfirm={handleAddWordsToTraining}
                zIndex={2000}>
                <PlayCircleOutlined key="add-to-training" style={iconStyle} />
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
                <StopOutlined key="remove-from-training" style={iconStyle} />
              </Popconfirm>,
              isUserOwnsCollection ? (
                <Popconfirm
                  title="Удалить коллекцию?"
                  description={
                    'Все слова коллекции также будут удалены из тренировок'
                  }
                  okText="Да"
                  cancelText="Нет"
                  onConfirm={handleDeleteCollection}
                  zIndex={2000}>
                  <DeleteOutlined key="delete" style={iconStyle} />
                </Popconfirm>
              ) : null,
            ]}>
            <Meta
              title={collection.name}
              description={collection.description || 'без описания'}
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
