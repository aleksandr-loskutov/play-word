import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Typography, Avatar, Button, message } from 'antd'
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

const cn = createCn('collection-page')
const { Title } = Typography

const CollectionPage = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const collections = useAppSelector(state => state.collections.collections)
  const training = useAppSelector(state => state.training.training)
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
      .then(coll => {
        message.success(`Слова добавлены в коллекцию ${coll?.name}`)
      })
      .catch(e => {
        message.error('Не удалось добавить слова в коллекцию ' + e.message)
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
        message.success('Слова коллекции добавлены в тренировку')
      })
      .catch((error: any) => {
        message.error(error.message || 'Не удалось добавить слова в тренировку')
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
        message.success('Слова коллекции удалены из тренировки')
      })
      .catch(_ => {
        message.error('Не удалось удалить слова из тренировки')
      })
  }

  const handleDeleteCollection = () => {
    if (!collection) return
    dispatch(deleteCollection(collection.id))
      .unwrap()
      .then(_ => {
        message.success('Коллекция удалена')
      })
      .catch(_ => {
        message.error('Не удалось удалить коллекцию')
      })
  }

  const handleCancel = () => {
    setShowAddWordsModal(false)
  }

  return (
    <Layout>
      <section className={cn('')}>
        <Title className={cn('title')}>Collection</Title>
        {collection && training && (
          <>
            <Title level={4}>{collection.name}</Title>
            <Card>
              <Avatar src={collection.image || ''} />
              <p>{collection.description || 'No description provided'}</p>
            </Card>
            <Button type="primary" onClick={handleAddWordsButton}>
              Добавить / Изменить слова
            </Button>
            <Button type="primary" onClick={handleAddWordsToTraining}>
              Добавить все слова коллекции в тренировку
            </Button>
            <Button type="primary" onClick={handleRemoveWordsFromTraining}>
              Убрать все слова коллекции из тренировки
            </Button>
            <Button type="default" onClick={handleDeleteCollection}>
              Удалить коллекцию
            </Button>
            <AddWordsModal
              onSubmit={handleSubmitAddWords}
              visible={showAddWordsModal}
              onClose={handleCancel}
              initialWords={collection.words}
            />
          </>
        )}
      </section>
    </Layout>
  )
}

export default CollectionPage
