import { useEffect, useRef, useState } from 'react'
import { UserWordProgress, WordInTraining } from '../../../types/training'
import { reverseWordAndTranslation } from '../utils'

const useQueue = (initialQueue: UserWordProgress[] = []) => {
  const [queue, setQueue] = useState<UserWordProgress[]>(initialQueue)
  const [resultingProgress, setResultingProgress] = useState<
    UserWordProgress[]
  >([])
  const [timeSpent, setTimeSpent] = useState<Map<number, number>>(new Map())
  const currentWordTimeStampRef = useRef<{
    wordId: number
    timeStamp: Date
  } | null>(null)

  const enqueue = (wordProgress: UserWordProgress) => {
    setQueue(prevQueue => [...prevQueue, wordProgress])
  }

  const dequeue = (withSave: boolean = true): UserWordProgress | undefined => {
    if (isEmpty()) return undefined
    const [currentProgress, ...remainingProgress] = queue
    setQueue(remainingProgress)
    if (withSave) saveToResultingArray(currentProgress)
    return currentProgress
  }

  useEffect(() => {
    if (queue.length > 0) {
      const firstElement = queue[0]
      const currentWordId = firstElement.wordId

      if (!currentWordTimeStampRef.current) {
        currentWordTimeStampRef.current = {
          wordId: currentWordId,
          timeStamp: new Date(),
        }
      } else {
        const { wordId, timeStamp } = currentWordTimeStampRef.current
        const spentTime = new Date().getTime() - timeStamp.getTime()
        const totalTime = (timeSpent.get(wordId) || 0) + spentTime
        setTimeSpent(prevTimeSpent =>
          new Map(prevTimeSpent).set(wordId, totalTime)
        )
        currentWordTimeStampRef.current = {
          wordId: currentWordId,
          timeStamp: new Date(),
        }
      }
    } else {
      currentWordTimeStampRef.current = null
    }
  }, [queue])

  const saveToResultingArray = (progressToSave: UserWordProgress) => {
    let totalTime = timeSpent.get(progressToSave.wordId) || 0
    if (
      currentWordTimeStampRef.current &&
      currentWordTimeStampRef.current.wordId === progressToSave.wordId
    ) {
      const spentTime =
        new Date().getTime() -
        currentWordTimeStampRef.current.timeStamp.getTime()
      totalTime += spentTime
      currentWordTimeStampRef.current = null
    }

    const totalTimeInMinutes = parseFloat((totalTime / 60000).toFixed(1))
    const updatedProgressToSave = {
      ...progressToSave,
      timeSpent: totalTimeInMinutes,
    }
    setResultingProgress(prevState => [...prevState, updatedProgressToSave])
    setTimeSpent(prevTimeSpent => {
      const newTimeSpent = new Map(prevTimeSpent)
      newTimeSpent.delete(progressToSave.wordId)
      return newTimeSpent
    })
  }

  const processQueueByAnswer = (isCorrect: boolean, maxErrorLimit: number) => {
    if (isEmpty()) return
    const [currentProgress, ...remainingProgress] = queue

    if (isCorrect) {
      const updatedSessionStage = currentProgress.word.sessionStage + 1

      let updatedProgress: UserWordProgress = {
        ...currentProgress,
        word: {
          ...currentProgress.word,
          sessionStage: updatedSessionStage,
        },
      }
      if (updatedSessionStage === 2) {
        updatedProgress = reverseWordAndTranslation(updatedProgress)
      }

      if (updatedProgress.word.sessionStage > 2) {
        setQueue(remainingProgress)
        saveToResultingArray(updatedProgress)
      } else {
        setQueue([...remainingProgress, updatedProgress])
      }
    } else {
      const { sessionStage: currentSessionStage, errorCounter } =
        currentProgress.word
      const wordErrors = errorCounter + 1
      let sessionStage
      if (currentProgress.stage === 0) {
        sessionStage = currentSessionStage
      } else {
        sessionStage = wordErrors >= maxErrorLimit ? 3 : currentSessionStage
      }

      const updatedProgress: UserWordProgress = {
        ...currentProgress,
        word: {
          ...currentProgress.word,
          sessionStage,
          errorCounter: wordErrors,
        },
      }

      if (sessionStage > 2) {
        setQueue(remainingProgress)
        saveToResultingArray(updatedProgress)
      } else {
        setQueue([...remainingProgress, updatedProgress])
      }
    }
  }

  const setQueueItems = (queueToSet: UserWordProgress[]) => {
    setQueue(queueToSet)
  }

  const peek = (): UserWordProgress => {
    return queue[0]
  }

  const word: WordInTraining = peek()?.word

  const isEmpty = (): boolean => {
    return queue.length === 0
  }

  const clear = () => {
    setQueue([])
    setResultingProgress([])
  }

  const log = () => {
    console.log('queue:', queue)
  }

  return {
    queue,
    enqueue,
    dequeue,
    word,
    resultingProgress,
    processQueueByAnswer,
    setQueue: setQueueItems,
    peekQueue: peek,
    isEmptyQueue: isEmpty,
    clearQueue: clear,
    logQueue: log,
  }
}

export default useQueue
