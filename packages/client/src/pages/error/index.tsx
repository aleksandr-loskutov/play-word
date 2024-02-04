import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import createCn from '../../utils/create-cn';
import './error.css';

const cn = createCn('error-page');

function ErrorPage() {
  return (
    <section className={cn()}>
      <Typography.Title className="title" level={1}>
        что-то пошло не так
      </Typography.Title>
      <Link to="/">
        <Button type="primary">На главную</Button>
      </Link>
    </section>
  );
}

export default ErrorPage;
