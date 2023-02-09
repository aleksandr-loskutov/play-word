import React from 'react';
import {Typography} from 'antd';

import Layout from '../../components/layout';
import createCn from '../../utils/create-cn';

import './error.css';

const cn = createCn('error-page');

function ErrorPage() {
  return (
    <Layout>
      <section className={cn()}>
        <Typography.Title>Что-то пошло не так</Typography.Title>
      </section>
    </Layout>
  )
}

export default ErrorPage;
