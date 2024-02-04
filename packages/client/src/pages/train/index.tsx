import { useState } from 'react';
import './styles.css';
import { useAppDispatch } from '../../components/hooks/store';
import createCn from '../../utils/create-cn';
import { useAuth } from '../../components/hooks/auth';
import { updateTraining } from '../../store/action-creators/training';
import { transformUserProgressToUpdateRequest } from '../../utils/transform-user-progress';
import { sortUserWordProgressByDate } from './utils';
import type { UserWordProgress, WordStats } from '../../types/training';
import { TrainingStats, TrainingStart } from './components';
import WithAuth from '../../components/hoc/withAuth';
import customNotification from '../../components/custom-notification/customNotification';
import TrainingInput from './components/trainingInput';

const cn = createCn('train-page');

function TrainPage() {
  const dispatch = useAppDispatch();
  const { user, training, setIsInTraining } = useAuth();
  const [queue, setQueue] = useState<UserWordProgress[]>([]);
  const [trainingStats, setTrainingStats] = useState<WordStats[]>([]);

  const handleFinishTraining = (
    resultingProgress: UserWordProgress[],
    stats: WordStats[]
  ) => {
    if (resultingProgress.length === 0) return;
    dispatch(
      updateTraining(transformUserProgressToUpdateRequest(resultingProgress))
    )
      .unwrap()
      .then(() => {
        customNotification({
          message: 'Успешно!',
          description: 'Сохранили тренировку.',
          type: 'success',
        });
      })
      .catch(() => {
        customNotification({
          message: 'Ошибка!',
          description: 'Не удалось сохранить тренировку.',
          type: 'error',
        });
      })
      .finally(() => {
        if (resultingProgress.length > 0 && stats.length > 0) {
          setTrainingStats(stats);
        }
        setIsInTraining(false);
      });
  };

  const handleStartTraining = () => {
    if (!user || training.length === 0) return;
    const sortedAndSlicedProgress = sortUserWordProgressByDate(training).slice(
      0,
      user.trainingSettings.wordsPerSession
    );
    setQueue(sortedAndSlicedProgress);
    setIsInTraining(true);
    setTrainingStats([]);
  };

  return (
    <section className={cn('')}>
      {queue.length === 0 && (
        <TrainingStart handleStartTraining={handleStartTraining} />
      )}
      {queue.length > 0 && (
        <TrainingInput initialQueue={queue} onFinish={handleFinishTraining} />
      )}
      {trainingStats.length > 0 && (
        <TrainingStats
          trainingStats={trainingStats}
          handleStartTraining={handleStartTraining}
        />
      )}
    </section>
  );
}

export default WithAuth(TrainPage);
