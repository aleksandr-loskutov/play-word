import { useCallback, useEffect } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { UserWordProgress, WordInTraining } from '../../../types/training';

type ActionButtonsProps = {
  word: WordInTraining;
  onLearnedButtonClick: () => void;
  onNextButtonClick: () => void;
  showAnswer: boolean;
  resultingProgress: UserWordProgress[];
  onFinishTraining: () => void;
};

function ActionButtons({
  word,
  onLearnedButtonClick,
  onNextButtonClick,
  showAnswer,
  resultingProgress,
  onFinishTraining,
}: ActionButtonsProps) {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onNextButtonClick();
      }
    },
    [onNextButtonClick]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Space>
      {resultingProgress.length > 0 && (
        <Popconfirm
          title="Завершить тренировку?"
          okText="Да"
          cancelText="Нет"
          onConfirm={onFinishTraining}
          zIndex={2000}>
          <Button type="dashed">завершить</Button>
        </Popconfirm>
      )}
      {word.sessionStage === 0 ? (
        <Button type="primary" onClick={onLearnedButtonClick}>
          Запомнил!
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={onNextButtonClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
              onNextButtonClick();
            }
          }}
          tabIndex={0}
          disabled={showAnswer}>
          не помню
        </Button>
      )}
    </Space>
  );
}

export default ActionButtons;
