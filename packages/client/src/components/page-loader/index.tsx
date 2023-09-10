import React from 'react';
import { Col, Row } from 'antd';

function PageLoader() {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Col>
        <div className={'spinner'}></div>
      </Col>
    </Row>
  );
}

export default PageLoader;
