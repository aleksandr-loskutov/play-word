import { Col, Progress, Row, Table, Typography } from 'antd';
import { TrainingStats } from '../../../types/training';
import createCn from '../../../utils/create-cn';

const { Paragraph } = Typography;

const cn = createCn('train-page');

function TrainingStatsTable({
  trainingStats,
  extraStats,
}: TrainingStats): React.ReactElement | null {
  const renderExtraHeader = () => (
    <Row gutter={24}>
      <Col span={6}>
        <Paragraph className={cn('paragraph')}>
          Итого время: {extraStats.totalTimeSpent.toFixed(1)} минут
        </Paragraph>
      </Col>
      <Col span={5}>
        <Paragraph className={cn('paragraph')}>
          Остаток: {extraStats.moreToLearn} слов
        </Paragraph>
      </Col>
      <Col span={13}>
        <span className={cn('paragraph')}>Прогресс: </span>
        <Progress
          status="active"
          percent={extraStats.currentDayProgress}
          className={cn('progress')}
          strokeColor={{ from: '#1b8aab', to: '#45f3ff' }}
        />
      </Col>
    </Row>
  );
  const columns = [
    {
      title: 'Слово',
      dataIndex: 'translation',
      key: 'translation',
    },
    {
      title: 'Перевод',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: 'Ступень',
      dataIndex: 'stage',
      key: 'stage',
    },
    {
      title: 'Коллекция',
      dataIndex: 'collectionName',
      key: 'collectionName',
    },
    {
      title: 'Время затр.',
      dataIndex: 'timeSpent',
      key: 'timeSpent',
      render: (timeSpent: number) => `${timeSpent} мин.`,
    },
    {
      title: 'Ошибок',
      dataIndex: 'errorCounter',
      key: 'errorCounter',
    },
    {
      title: 'След. подход',
      dataIndex: 'nextReview',
      key: 'nextReview',
      render: (nextReview: Date) => {
        const today = new Date();
        const timeDifferenceInMilliseconds =
          nextReview.getTime() - today.getTime();
        const timeDifferenceInDays = parseFloat(
          (timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)).toFixed(1)
        );
        return `через ${timeDifferenceInDays} дней`;
      },
    },
  ];

  return trainingStats.length > 0 ? (
    <Table
      dataSource={trainingStats}
      columns={columns}
      pagination={false}
      rowKey={(record) => record.word}
      caption={renderExtraHeader()}
    />
  ) : null;
}

export default TrainingStatsTable;
