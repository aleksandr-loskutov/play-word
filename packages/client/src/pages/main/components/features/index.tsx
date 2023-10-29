import { Card, Col, Row } from 'antd';
import createCn from '../../../../utils/create-cn';
import './style.css';

const cn = createCn('features');

function Features(): React.ReactElement {
  const cardsInfo = [
    { id: 1, title: 'Создайте свою или выберите коллекцию слов для изучения;' },
    { id: 2, title: 'Изучайте и повторяйте слова в тренажере;' },
    {
      id: 3,
      title: 'Успешное повторение слова увеличивает интервал на повтор;',
    },
    {
      id: 4,
      title: 'Слово будет предложено к повторению через 1, 7, 30 и 90 дней;',
    },
  ];

  return (
    <Row justify="center" align="middle" gutter={[16, 16]} className={cn()}>
      {cardsInfo.map((card) => (
        <Col
          key={card.id}
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}>
          <Card
            className={cn('custom-card')}
            title={card.id}
            bordered
            headStyle={{
              color: `#45f3ff`,
              fontSize: '1.5rem',
              textAlign: 'center',
            }}
            bodyStyle={{ padding: '13px' }}>
            {card.title}
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Features;
