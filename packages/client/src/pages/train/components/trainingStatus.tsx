import React from 'react';
import { Typography } from 'antd';
import { UserWordProgress, WordInTraining } from '../../../types/training';
const { Paragraph } = Typography;

type TrainingStatusProps = {
  resultingProgress: UserWordProgress[];
  queue: UserWordProgress[];
  word: WordInTraining;
  totalErrorsCount: number;
};

const TrainingStatus: React.FC<TrainingStatusProps> = ({
  resultingProgress,
  queue,
  word,
  totalErrorsCount,
}) => {
  return (
    <>
      <Paragraph>
        Пройдено: {resultingProgress.length}. Осталось: {queue.length}.
      </Paragraph>
      <Paragraph>
        Ошибок для слова: {word.errorCounter}. Ошибок всего: {totalErrorsCount}{' '}
      </Paragraph>
    </>
  );
};

export default TrainingStatus;
