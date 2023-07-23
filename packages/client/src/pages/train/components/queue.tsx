import { useState } from 'react'
import { UserWordProgress } from '../../../types/training'

const useQueue = (initialQueue: UserWordProgress[] = []) => {
  const [queue, setQueue] = useState<UserWordProgress[]>(initialQueue)
  const [resultingProgress, setResultingProgress] = useState<
    UserWordProgress[]
  >([])

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

  const saveToResultingArray = (progressToSave: UserWordProgress) => {
    setResultingProgress(prevState => [...prevState, progressToSave])
  }

  const processQueueByAnswer = (isCorrect: boolean, maxErrorLimit: number) => {
    if (isEmpty()) return
    const [currentProgress, ...remainingProgress] = queue

    if (isCorrect) {
      const updatedProgress: UserWordProgress = {
        ...currentProgress,
        word: {
          ...currentProgress.word,
          sessionStage: currentProgress.word.sessionStage + 1,
        },
      }

      if (updatedProgress.word.sessionStage > 2) {
        saveToResultingArray(updatedProgress)
        setQueue(remainingProgress)
      } else {
        setQueue([...remainingProgress, updatedProgress])
      }
    } else {
      const { sessionStage: currentSessionStage, errorCounter } =
        currentProgress.word
      const wordErrors = errorCounter + 1
      const sessionStage = wordErrors >= maxErrorLimit ? 3 : currentSessionStage

      const updatedProgress: UserWordProgress = {
        ...currentProgress,
        word: {
          ...currentProgress.word,
          sessionStage,
          errorCounter: wordErrors,
        },
      }

      if (sessionStage > 2) {
        saveToResultingArray(updatedProgress)
        setQueue(remainingProgress)
      } else {
        setQueue([...remainingProgress, updatedProgress])
      }
    }
  }

  const setQueueItems = (queueToSet: UserWordProgress[]) => {
    setQueue(queueToSet)
  }

  const peek = (): UserWordProgress | undefined => {
    return queue.length > 0 ? queue[0] : undefined
  }

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
