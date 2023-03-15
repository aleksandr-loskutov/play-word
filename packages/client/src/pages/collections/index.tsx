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
} from 'antd'
import './styles.css'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAppDispatch, useAppSelector } from '../../components/hooks/store'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/hooks/auth'
import {
  createCollection,
  getUserCollections,
} from '../../store/action-creators/collection'
import PageLoader from '../../components/page-loader'
import Link from 'antd/es/typography/Link'

const { Title } = Typography
const cn = createCn('collections-page')

type Values = {
  name: string
  description: string
  isPublic: boolean
}

type CollectionCreateFormProps = {
  open: boolean
  onCreate: (values: Values) => void
  onCancel: () => void
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm()
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields(['name'])
          .then(values => {
            form.resetFields()
            onCreate(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ isPublic: true }}
      >
        <Form.Item
          name="name"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collections!',
            },
            { min: 4, message: 'Title must be more than 4 characters' },
            { max: 40, message: 'Title must be less than 40 characters' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="isPublic"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value={true}>Public</Radio>
            <Radio value={false}>Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

function CollectionsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  useEffect(() => {
    dispatch(getUserCollections())
  }, [dispatch])
  const [open, setOpen] = useState(false)
  const onCreate = (values: any) => {
    setOpen(false)
    dispatch(createCollection(values))
  }
  const { isLoading, collections } = useAppSelector(state => state.collections)

  return (
    <Layout>
      <section className={cn('')}>
        <Title className={cn('title')}>User collections</Title>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true)
            }}
          >
            New Collection
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false)
            }}
          />
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <Row gutter={[60, 20]}>
            {collections.map(collection => (
              <Col key={collection.id} span={30}>
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
                  <Button
                    onClick={() => navigate(`/collections/${collection.id}`)}
                  >
                    Редактировать
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </Layout>
  )
}

export default CollectionsPage
