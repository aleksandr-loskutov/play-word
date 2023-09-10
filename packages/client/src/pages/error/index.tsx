import React from 'react';
import { Button, Typography } from 'antd';
import createCn from '../../utils/create-cn';
import './error.css';
import { Link } from 'react-router-dom';

const cn = createCn('error-page');

function ErrorPage() {
  return (
    <section className={cn()}>
      <Typography.Title>Что-то пошло не так</Typography.Title>
      <Link to="/">
        <Button type="primary">На главную</Button>
      </Link>
    </section>
  );
}

export default ErrorPage;
