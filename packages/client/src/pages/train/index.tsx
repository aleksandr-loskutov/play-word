import React, { useState, useEffect } from 'react'
import './styles.css'
import { Button, message, Typography } from 'antd'
import { useAppDispatch } from '../../components/hooks/store'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAuth } from '../../components/hooks/auth'
import { TRAINING_SETTINGS } from '../../utils/training-settings'
import Countdown from './components/countdown'
import { updateTraining } from '../../store/action-creators/training'
import { transformUserProgressToUpdateRequest } from '../../utils/transform-user-progress'
import PageLoader from '../../components/page-loader'
import { sortUserWordProgressByDate } from './utils'
import useQueue from './components/queue'
import TrainingInput from './components/trainingInput'
const { Title, Paragraph } = Typography
const { countdownVisualBlocksLimit } = TRAINING_SETTINGS

const cn = createCn('train-page')

const TrainPage = () => {
  const dispatch = useAppDispatch()
  const { user, isLoading, training, isLoadingTraining } = useAuth()

  const {
    queue,
    setQueue,
    resultingProgress,
    word,
    isEmptyQueue,
    clearQueue,
    processQueueByAnswer,
  } = useQueue()

  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const [resetKey, setResetKey] = useState(0)
  const [nextButton, setNextButton] = useState(false)
  const isLoaded = user && !isLoading && !isLoadingTraining

  useEffect(() => {
    if (isLoaded) {
      setTimerSeconds(user.trainingSettings.countdownTimeInSec)
    }
  }, [isLoaded])

  useEffect(() => {
    if (isEmptyQueue() && resultingProgress.length > 0) handleFinishTraining()
  }, [queue])

  const handleFinishTraining = () => {
    if (resultingProgress.length === 0) return
    dispatch(
      updateTraining(transformUserProgressToUpdateRequest(resultingProgress))
    )
      .unwrap()
      .then(() => {
        message.success('Успешно сохранили тренировку!')
      })
      .catch((error: any) => {
        message.error(
          error.message || 'Не удалось сохранить прогресс тренировки'
        )
      })
      .finally(() => clearQueue())
  }

  const handleTimerComplete = () => {
    setNextButton(true)
  }

  const handleNextButtonClick = () => {
    setNextButton(true)
  }

  const restartTimer = () => {
    if (!user) return
    setTimerSeconds(user.trainingSettings.countdownTimeInSec)
    // Update resetKey to trigger Countdown component reset
    setResetKey(prevKey => prevKey + 1)
  }

  const handleStartTraining = () => {
    if (!user || training.length === 0) return
    const sortedAndSlicedProgress = sortUserWordProgressByDate(training).slice(
      0,
      user.trainingSettings.wordsPerSession
    )
    setQueue(sortedAndSlicedProgress)
  }

  const handleAnswer = (isCorrect: boolean) => {
    isCorrect ? message.success('Ok!') : message.error('Incorrect!')
    const { wordErrorLimit } = user?.trainingSettings ?? { wordErrorLimit: 3 }
    processQueueByAnswer(isCorrect, wordErrorLimit)

    if (useCountDown) restartTimer()
    setNextButton(false)
  }

  const handleLearned = () => {
    handleAnswer(true)
    setShowAnswer(false)
  }

  const useCountDown =
    user && user.trainingSettings.useCountdown && word?.sessionStage !== 0

  return (
    <Layout>
      <section className={cn('')}>
        {/*<Title level={3}>Тренировка</Title>*/}
        {isLoaded ? (
          <div style={{ textAlign: 'center', marginTop: 5 }}>
            {!isEmptyQueue() && word ? (
              <div style={{ marginTop: 60 }}>
                <Title level={1}>{word.word.toUpperCase()}</Title>
                <TrainingInput
                  currentWord={word}
                  onAnswer={handleAnswer}
                  showAnswer={showAnswer}
                  setShowAnswer={setShowAnswer}
                  isNextButtonClicked={nextButton}
                />
                {useCountDown && (
                  <Countdown
                    key={resetKey}
                    seconds={timerSeconds}
                    onComplete={handleTimerComplete}
                    maxBlocks={countdownVisualBlocksLimit}
                  />
                )}
                <br />
                <br />
                {word.sessionStage === 0 ? (
                  <Button type="primary" onClick={handleLearned}>
                    Запомнил!
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleNextButtonClick}
                    disabled={showAnswer}>
                    Показать перевод
                  </Button>
                )}{' '}
                <br />
                <br />
                <Paragraph>Ошибок: {word.errorCounter}</Paragraph>
                <Paragraph>Слов в очереди: {queue.length}</Paragraph>
              </div>
            ) : (
              <div>
                <Paragraph>
                  {training.length > 0
                    ? `У вас ${
                        training.length
                      } слов для повторения, давайте начнем! \r\n Вы тренируете ${
                        user.trainingSettings.wordsPerSession
                      }  слов за подход ${
                        user.trainingSettings.useCountdown
                          ? 'с таймером'
                          : 'без таймера'
                      }`
                    : 'У вас нет слов для повторения. Добавьте новые из коллекций или подождите пока текущие не "созреют".'}
                </Paragraph>
                {training.length > 0 && (
                  <Button
                    type="primary"
                    onClick={handleStartTraining}
                    autoFocus>
                    Начать
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <PageLoader />
        )}
      </section>
    </Layout>
  )
}

export default TrainPage
