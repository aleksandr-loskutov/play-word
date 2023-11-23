import React, { useMemo } from 'react';
import Title from 'antd/lib/typography/Title';
import { Button, Col, Row } from 'antd';
import type { WordStats } from '../../../types/training';
import TrainingStatsTable from './trainingStatsTable';
import { useAuth } from '../../../components/hooks/auth';
import createCn from '../../../utils/create-cn';
import { getTotalTimeSpent } from '../utils';
import '../styles.css';

type TrainingStatsProps = {
  trainingStats: WordStats[];
  handleStartTraining: () => void;
};
const cn = createCn('train-page');

function TrainingStats({
  trainingStats,
  handleStartTraining,
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
      {training.length > 0 && (
        <Col span={24} className={cn('stats-action-box')}>
          <Button type="primary" onClick={handleStartTraining}>
            Продолжить тренировку
          </Button>
        </Col>
      )}
    </Row>
  ) : null;
}

export default TrainingStats;
