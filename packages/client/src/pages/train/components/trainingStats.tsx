import React, { useCallback, useMemo } from 'react';
import Title from 'antd/lib/typography/Title';
import { WordStats } from '../../../types/training';
import TrainingStatsTable from './trainingStatsTable';
import { useAuth } from '../../../components/hooks/auth';
import createCn from '../../../utils/create-cn';
import { getTotalTimeSpent } from '../utils';

type TrainingStatsProps = {
  trainingStats: WordStats[];
};
const cn = createCn('train-page');

const TrainingStats: React.FC<TrainingStatsProps> = ({ trainingStats }) => {
  const { training } = useAuth();
  const extraStats = useMemo(() => {
    return {
      totalTimeSpent: getTotalTimeSpent(trainingStats),
      currentDayProgress: Math.round(
        (trainingStats.length / (trainingStats.length + training.length)) * 100,
      ),
      moreToLearn: training.length,
    };
  }, [trainingStats, training]);

  return trainingStats.length > 0 ? (
    <div className={cn()}>
      <Title level={2} className={cn('title')} style={{ color: 'white' }}>
        Результаты тренировки
      </Title>
      <TrainingStatsTable
        trainingStats={trainingStats}
        extraStats={extraStats}
      />
    </div>
  ) : null;
};

export default TrainingStats;
