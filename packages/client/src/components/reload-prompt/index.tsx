import { InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row } from 'antd';
import { useRegisterSW } from 'virtual:pwa-register/react';
import createCn from '../../utils/create-cn';
import './style.css';

const cn = createCn('reload-prompt');

function ReloadPrompt(): React.ReactElement {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = (): void => {
    setNeedRefresh(false);
  };

  const reloadContent = (): void => {
    updateServiceWorker(true);
    close();
  };

  return (
    <Row justify="center" className={cn('')}>
      <Col>
        {needRefresh && (
          <Alert
            message="Доступно обновление"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className={cn('alert')}
            action={
              <Button size="small" type="primary" onClick={reloadContent}>
                обновить
              </Button>
            }
            onClose={close}
          />
        )}
      </Col>
    </Row>
  );
}

export default ReloadPrompt;
