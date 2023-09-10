import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import createCn from '../../utils/create-cn';
import './styles.css';
import Paragraph from 'antd/lib/typography/Paragraph';

const { Title } = Typography;
const cn = createCn('not-found-page');

function NotFoundPage() {
  return (
    <section className={cn()}>
      <Title>404</Title>
      <Paragraph className={cn('text')}>Страница не найдена</Paragraph>
      <Link to="/">
        <Button type="primary">На главную</Button>
      </Link>
    </section>
  );
}

export default NotFoundPage;
