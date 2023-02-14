import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Typography, Avatar } from 'antd'
import { useAppSelector } from '../../../components/hooks/store'
import Layout from '../../../components/layout'
import createCn from '../../../utils/create-cn'

const cn = createCn('collections-page')
const { Title } = Typography

const CollectionPage = () => {
  const { id } = useParams()
  const collections = useAppSelector(state => state.collections.collections)
  const collection = collections.find(c => c.id === Number(id))

  if (!collection) {
    return <div>Collection not found</div>
  }

  return (
    <Layout>
      <section className={cn('')}>
        <Title className={cn('title')}>Collection</Title>
        <Title level={4}>{collection.name}</Title>
        <Card>
          <Avatar src={collection.image || ''} />
          <p>{collection.description || 'No description provided'}</p>
        </Card>
      </section>
    </Layout>
  )
}

export default CollectionPage
