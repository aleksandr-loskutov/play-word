import { Col, Row } from 'antd';

function PageLoader() {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Col>
        <div className="spinner" />
      </Col>
    </Row>
  );
}

export default PageLoader;
