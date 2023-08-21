import React from 'react'
import { Button, Typography } from 'antd'
import { useAuth } from '../../../components/hooks/auth'
import createCn from '../../../utils/create-cn'
const { Paragraph } = Typography

type TrainingStartProps = {
  handleStartTraining: () => void
}
const cn = createCn('train-page')
const TrainingStart: React.FC<TrainingStartProps> = ({
  handleStartTraining,
}) => {
  const { user, training } = useAuth()
  return (
    user && (
      <>
        <Paragraph>
          {training.length > 0
            ? `У вас есть ${
                training.length
              } слов для повторения, давайте начнем! \r\n Вы тренируете до ${
                user.trainingSettings.wordsPerSession
              }  слов за подход ${
                user.trainingSettings.useCountdown
                  ? 'с таймером'
                  : 'без таймера'
              }`
            : 'У вас нет слов для повторения. Добавьте новые из коллекций или подождите пока текущие не "созреют".'}
        </Paragraph>

        {training.length > 0 && (
          <Button type="primary" onClick={handleStartTraining} autoFocus>
            Начать
          </Button>
        )}
      </>
    )
  )
}

export default TrainingStart