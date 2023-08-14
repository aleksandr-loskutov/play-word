import React, { useState, useEffect } from 'react'
import './styles.css'
import { message } from 'antd'
import { useAppDispatch } from '../../components/hooks/store'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAuth } from '../../components/hooks/auth'
import { TRAINING_SETTINGS } from '../../utils/training-settings'
import { updateTraining } from '../../store/action-creators/training'
import { transformUserProgressToUpdateRequest } from '../../utils/transform-user-progress'
import PageLoader from '../../components/page-loader'
import { getWordStats, sortUserWordProgressByDate } from './utils'
import { WordStats } from '../../types/training'
const { countdownVisualBlocksLimit } = TRAINING_SETTINGS
import {
  WordWithTooltip,
  TrainingInput,
  Countdown,
  useQueue,
  ActionButtons,
  TrainingStats,
  TrainingStart,
  TrainingStatus,
} from './components'
import WithAuth from '../../components/hoc/withAuth'

const cn = createCn('train-page')

const TrainPage = () => {
  const dispatch = useAppDispatch()
  const { user, isLoading, training, isLoadingTraining } = useAuth()

  const {
    queue,
    setQueue,
    peekQueue,
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
  const [trainingStats, setTrainingStats] = useState<WordStats[]>([])
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
      .finally(() => {
        if (resultingProgress.length > 0) {
          const trainingStats = getTrainingStats()
          setTrainingStats(trainingStats)
        }
        clearQueue()
      })
  }

  const handleNextButtonClick = () => {
    setNextButton(true)
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

    // if (useCountDown) restartTimer()
    setNextButton(false)
  }

  const handleLearned = () => {
    handleAnswer(true)
    setShowAnswer(false)
  }

  const getTrainingStats = (): WordStats[] => {
    if (!user || resultingProgress.length === 0) return []
    return getWordStats(resultingProgress, user.trainingSettings)
  }

  const getTotalErrorsCount = (): number => {
    const errorsFromResultingProgress = getTrainingStats().reduce(
      (accumulator, word) => accumulator + word.errorCounter,
      0
    )
    const errorsFromQueue = queue.reduce(
      (accumulator, word) => accumulator + word.word.errorCounter,
      0
    )
    return errorsFromResultingProgress + errorsFromQueue
  }

  const totalErrorsCount =
    user && resultingProgress.length === 0 ? getTotalErrorsCount() : 0

  return (
    <section className={cn('')}>
      <div style={{ textAlign: 'center', marginTop: 5 }}>
        {!isEmptyQueue() && word ? (
          <div style={{ marginTop: 60 }}>
            <WordWithTooltip
              word={word.word.toUpperCase()}
              collectionName={peekQueue()?.collectionName}
              showCollectionNameHint={
                user.trainingSettings.showCollectionNameHint
              }
            />
            <TrainingInput
              currentWord={word}
              onAnswer={handleAnswer}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              isNextButtonClicked={nextButton}
            />
            <br />
            <ActionButtons
              word={word}
              handleLearned={handleLearned}
              handleNextButtonClick={handleNextButtonClick}
              showAnswer={showAnswer}
              resultingProgress={resultingProgress}
              handleFinishTraining={handleFinishTraining}
            />
            <br /> <br />
            <TrainingStatus
              resultingProgress={resultingProgress}
              queue={queue}
              word={word}
              totalErrorsCount={totalErrorsCount}
            />
            <br />
          </div>
        ) : (
          <>
            <TrainingStats trainingStats={trainingStats} />
            <TrainingStart handleStartTraining={handleStartTraining} />
          </>
        )}
      </div>
    </section>
  )
}

export default WithAuth(TrainPage)
