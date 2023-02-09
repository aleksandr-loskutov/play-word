import { Button, Typography } from 'antd'
import { Link } from 'react-router-dom'

import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'

import './styles.css'

const { Title } = Typography
const cn = createCn('train-page')

function TrainPage() {
  return (
    <Layout>
      <div className={cn('content')}>
        <div className={cn('content-item')}>
          <section className={cn()}>
            <Title>Train</Title>
            <p className={cn('text')}>Word</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default TrainPage
