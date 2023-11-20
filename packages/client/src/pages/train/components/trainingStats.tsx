import React, { useMemo } from 'react';
import Title from 'antd/lib/typography/Title';
import { Col, Row } from 'antd';
import type { WordStats } from '../../../types/training';
import TrainingStatsTable from './trainingStatsTable';
import { useAuth } from '../../../components/hooks/auth';
import createCn from '../../../utils/create-cn';
import { getTotalTimeSpent } from '../utils';
import '../styles.css';

type TrainingStatsProps = {
  trainingStats: WordStats[];
};
const cn = createCn('train-page');

function TrainingStats({
  trainingStats,
}: TrainingStatsProps): React.ReactElement | null {
  const { training } = useAuth();
  const extraStats = useMemo(
    () => ({
      totalTimeSpent: getTotalTimeSpent(trainingStats),
      currentDayProgress: Math.round(
        (trainingStats.length / (trainingStats.length + training.length)) * 100
      ),
      moreToLearn: training.length,
    }),
    [trainingStats, training]
  );

  return trainingStats.length > 0 ? (
    <Row className={cn()}>
      <Col span={24} className={cn('stats-box')}>
        <Title level={3}>Результаты тренировки</Title>
        <TrainingStatsTable
          trainingStats={trainingStats}
          extraStats={extraStats}
        />
      </Col>
    </Row>
  ) : null;
}

export default TrainingStats;
