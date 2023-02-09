import React, { useState, useEffect } from 'react'
import { Button, Typography, Card, Row, Col, Avatar } from 'antd'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { Collection } from '../../types/collection'
import collectionsAPI from '../../api/collections'

const { Title } = Typography
const cn = createCn('collection-page')

function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    async function fetchCollections() {
      const collections = await collectionsAPI.getAll()
      setCollections(collections.data || [])
    }
    fetchCollections()
  }, [])

  return (
    <Layout>
      <section className={cn('')}>
        <Title className={cn('title')}>User collections</Title>
        <Row gutter={[16, 16]}>
          {collections.map(collection => (
            <Col key={collection.id} span={8}>
              <Card className={cn('card')}>
                <h4 className={cn('card-title')}>{collection.name}</h4>
                <Avatar className={cn('card-image')} src={collection.image} />
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
            </Col>
          ))}
        </Row>
      </section>
    </Layout>
  )
}

export default CollectionsPage
