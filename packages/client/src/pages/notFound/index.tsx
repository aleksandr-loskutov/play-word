import {Button, Typography} from 'antd';
import { Link } from 'react-router-dom';

import Layout from '../../components/layout';
import createCn from '../../utils/create-cn';

import './styles.css';

const { Title } = Typography;
const cn = createCn('not-found-page');

function NotFoundPage() {
  return (
    <Layout>
      <section className={cn()}>
        <Title>404</Title>
        <p className={cn('text')}>Страница не найдена</p>
        <Link to='/'>
          <Button type='primary'>
            На главную
          </Button>
        </Link>
      </section>
    </Layout>
  )
}

export default NotFoundPage;
