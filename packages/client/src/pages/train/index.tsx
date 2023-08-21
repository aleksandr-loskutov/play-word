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
import { UserWordProgress, WordStats } from '../../types/training'
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
  const [queue, setQueue] = useState<UserWordProgress[]>([])
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [nextButton, setNextButton] = useState(false)
  const [trainingStats, setTrainingStats] = useState<WordStats[]>([])
  const isLoaded = user && !isLoading && !isLoadingTraining

  const handleFinishTraining = (
    resultingProgress: UserWordProgress[],
    trainingStats: WordStats[]
  ) => {
    if (resultingProgress.length === 0) return
    console.log('resultingProgress', resultingProgress)
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
        if (resultingProgress.length > 0 && trainingStats.length > 0) {
          setTrainingStats(trainingStats)
        }
      })
  }

  const handleStartTraining = () => {
    if (!user || training.length === 0) return
    const sortedAndSlicedProgress = sortUserWordProgressByDate(training).slice(
      0,
      user.trainingSettings.wordsPerSession
    )
    setQueue(sortedAndSlicedProgress)
  }

  return (
    <section className={cn('')}>
      <div style={{ textAlign: 'center', marginTop: 5 }}>
        <div style={{ marginTop: 60 }}>
          {queue.length === 0 && (
            <TrainingStart handleStartTraining={handleStartTraining} />
          )}
          {queue.length > 0 && (
            <TrainingInput
              initialQueue={queue}
              onFinish={handleFinishTraining}
            />
          )}
          {trainingStats.length > 0 && (
            <TrainingStats trainingStats={trainingStats} />
          )}
        </div>
      </div>
    </section>
  )
}

export default WithAuth(TrainPage)
