import React from 'react'
import { Button, Space, Modal, Popconfirm } from 'antd'
import { UserWordProgress, WordInTraining } from '../../../types/training'
import Icon from '@ant-design/icons'

type ActionButtonsProps = {
  word: WordInTraining
  handleLearned: () => void
  handleNextButtonClick: () => void
  showAnswer: boolean
  resultingProgress: UserWordProgress[]
  handleFinishTraining: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  word,
  handleLearned,
  handleNextButtonClick,
  showAnswer,
  resultingProgress,
  handleFinishTraining,
}) => {
  return (
    <Space>
      {resultingProgress.length > 0 && (
        <Popconfirm
          title="Завершить тренировку?"
          okText="Да"
          cancelText="Нет"
          onConfirm={handleFinishTraining}
          icon={<Icon type="exclamation-circle" style={{ color: 'red' }} />}
          zIndex={2000}>
          <Button type="dashed">завершить</Button>
        </Popconfirm>
      )}
      {word.sessionStage === 0 ? (
        <Button type="primary" onClick={handleLearned}>
          Запомнил!
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={handleNextButtonClick}
          disabled={showAnswer}>
          не помню
        </Button>
      )}
    </Space>
  )
}

export default ActionButtons
