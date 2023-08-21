import React, { useState, useEffect, useRef } from 'react'
import { Input, InputRef, message, Space } from 'antd'
import {
  UserWordProgress,
  WordInTraining,
  WordStats,
} from '../../../types/training'
import {
  KEY_MAPPINGS,
  TRAINING_SETTINGS,
} from '../../../utils/training-settings'
import createCn from '../../../utils/create-cn'
import { useAuth } from '../../../components/hooks/auth'
import SpeechRecognizer from './speechRecognizer'
import WordPlayer from './wordPlayer'
import {
  ActionButtons,
  Countdown,
  TrainingStatus,
  useQueue,
  WordWithTooltip,
} from './index'
import { getWordStats } from '../utils'
import BeamHighlight from './beamHighlight'
const { successWordShowTime, errorLetterShowTime, countdownVisualBlocksLimit } =
  TRAINING_SETTINGS

type InputProps = {
  initialQueue: UserWordProgress[]
  onFinish: (
    resultingProgress: UserWordProgress[],
    trainingStats: WordStats[]
  ) => void
}

const cn = createCn('train-page')

const TrainingInput: React.FC<InputProps> = ({ initialQueue, onFinish }) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [lockInput, setLockInput] = useState<boolean>(false)
  const [mistypeCount, setMistypeCount] = useState<number>(0)
  const [resetKey, setResetKey] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const inputRef = useRef<InputRef>(null)
  const isSpeechRecognizerSetInput = useRef<boolean>(false)
  const { user, isLoading, training, isLoadingTraining } = useAuth()
  const {
    queue,
    setQueue,
    peekQueue,
    resultingProgress,
    word: currentWord,
    isEmptyQueue,
    clearQueue,
    processQueueByAnswer,
  } = useQueue()
  const isZeroStage = currentWord?.sessionStage === 0
  const isLoaded = user && currentWord && !isLoading && !isLoadingTraining

  useEffect(() => {
    if (currentWord) {
      trainWord()
    }
  }, [currentWord])

  useEffect(() => {
    if (initialQueue.length > 0 && isEmptyQueue()) {
      setQueue(initialQueue)
    }
  }, [initialQueue])

  useEffect(() => {
    if (isEmptyQueue() && resultingProgress.length > 0) {
      handleFinishTraining()
    }
  }, [queue])

  const handleFinishTraining = () => {
    if (resultingProgress.length > 0 && user) {
      console.log('handleFinishTraining')
      onFinish(
        resultingProgress,
        getWordStats(resultingProgress, user.trainingSettings)
      )
      clearQueue()
    }
  }

  useEffect(() => {
    if (isLoaded) {
      setTimerSeconds(user.trainingSettings.countdownTimeInSec)
    }
  }, [isLoaded])

  const trainWord = () => {
    const isShowAnswer = isZeroStage || showAnswer
    setShowAnswer(isShowAnswer)
    setInputValue(isShowAnswer ? currentWord?.translation : '')
    setMistypeCount(0)
    inputRef.current?.focus()

    setLockInput(isShowAnswer)
  }

  const processAnswer = (isCorrect: boolean) => {
    setLockInput(true)
    console.log('input', inputValue)
    setInputValue(currentWord.translation)
    setShowAnswer(true)
    setMistypeCount(0)
    //таймаут не нужен если первое касание со словом
    const timeout = currentWord.sessionStage === 0 ? 0 : successWordShowTime
    setTimeout(() => {
      setLockInput(false)
      setShowAnswer(false)
      if (useCountDown) restartTimer()
      handleAnswer(isCorrect)
    }, timeout)
  }

  const handleAnswer = (isCorrect: boolean) => {
    // isCorrect ? message.success('Ok!') : message.error('Incorrect!')
    const { wordErrorLimit } = user?.trainingSettings ?? { wordErrorLimit: 3 }
    processQueueByAnswer(isCorrect, wordErrorLimit)
  }

  const handleLearned = () => {
    handleAnswer(true)
    setShowAnswer(false)
  }

  const setIncorrectTemporaryInputValue = (character: string) => {
    setLockInput(true)
    setInputValue(prevInputValue => {
      const newInputValue = prevInputValue + character
      setTimeout(() => {
        restoreCorrectInputValue()
      }, errorLetterShowTime)

      return newInputValue
    })
  }

  const restoreCorrectInputValue = () => {
    setInputValue(prevInputValue => {
      const correctInputValue = prevInputValue
        .split('')
        .filter((char, index) => {
          const translationChar = currentWord.translation.charAt(index)
          return char === translationChar
        })
        .join('')
      return correctInputValue
    })

    setLockInput(false)
    inputRef?.current?.focus()
  }

  const handleSpeech = (text: string) => {
    isSpeechRecognizerSetInput.current = true
    setInputValue(text.toLowerCase())
  }

  const validateInput = () => {
    if (inputValue === currentWord.translation) {
      processAnswer(true)
    } else if (inputValue.length >= currentWord.translation.length / 2) {
      if (currentWord.translation.startsWith(inputValue)) {
        processAnswer(true)
      } else {
        //incorrect input from speech recognizer
        processIncorrectInput('')
      }
    }
  }

  const processIncorrectInput = (incorrectChar: string) => {
    setMistypeCount(prevMistypeCount => prevMistypeCount + 1)
    if (user && mistypeCount >= user.trainingSettings.wordMistypeLimit) {
      processAnswer(false)
      return
    }
    if (isSpeechRecognizerSetInput.current) {
      setIncorrectTemporaryInputValue(incorrectChar)
      return
    }
    if (inputValue.length < currentWord.translation.length) {
      setIncorrectTemporaryInputValue(incorrectChar)
    }
  }

  const handleNextButtonClick = () => {
    processAnswer(false)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase()
    const keyCode = event.code

    if (keyCode === 'Backspace' && !lockInput) {
      backspaceEmulation()
      return
    }
    if (keyCode === 'Space') {
      event.preventDefault()
    }

    if (lockInput) return

    if (KEY_MAPPINGS.hasOwnProperty(keyCode)) {
      const keyMappings = Object.entries(KEY_MAPPINGS[keyCode])[0]
      const translationChar = currentWord.translation.charAt(inputValue.length)

      if (keyMappings.includes(translationChar)) {
        setInputValue(prevInputValue => prevInputValue + translationChar)
        validateInput()
      } else {
        let switchedIncorrectCharacterByLang = pressedKey
        //подмена ввода ( для ошибочных букв  с неверной раскладкой)
        if (keyMappings.includes(pressedKey)) {
          if (currentWord.sessionStage === 1) {
            switchedIncorrectCharacterByLang = keyMappings[1]
          }
          if (currentWord.sessionStage === 2) {
            switchedIncorrectCharacterByLang = keyMappings[0]
          }
        }
        processIncorrectInput(switchedIncorrectCharacterByLang)
      }
    }
  }

  useEffect(() => {
    if (isSpeechRecognizerSetInput.current) {
      validateInput()
    }

    inputRef?.current?.focus()
    document.addEventListener('keydown', handleKeyPress)
    isSpeechRecognizerSetInput.current = false
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [inputValue, currentWord])

  const backspaceEmulation = () => {
    setInputValue(prevInputValue => {
      if (prevInputValue.length === 0) {
        return prevInputValue
      }

      return prevInputValue.slice(0, -1)
    })
  }

  const handleTimerComplete = () => {
    processAnswer(false)
  }

  const restartTimer = () => {
    if (!user) return
    setTimerSeconds(user.trainingSettings.countdownTimeInSec)
    // Update resetKey to trigger Countdown component reset
    setResetKey(prevKey => prevKey + 1)
  }

  const userSpeechLang = currentWord?.sessionStage === 1 ? 'ru-RU' : 'en-US'
  const synthSpeechLang = currentWord?.sessionStage === 1 ? 'en-US' : 'ru-RU'

  const inputClassName = !lockInput
    ? ''
    : showAnswer && inputValue === currentWord?.translation
    ? 'correct'
    : 'incorrect'

  const useCountDown = !!(
    user &&
    user.trainingSettings.useCountdown &&
    currentWord?.sessionStage !== 0 &&
    !showAnswer
  )

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
    isLoaded && (
      <>
        <WordWithTooltip
          word={currentWord.word.toUpperCase()}
          collectionName={peekQueue()?.collectionName}
          showCollectionNameHint={user.trainingSettings.showCollectionNameHint}
        />
        <div style={{ position: 'relative' }}>
          <Input
            placeholder="перевод"
            value={inputValue}
            disabled={lockInput}
            className={cn(`train-input ${inputClassName}`)}
            ref={inputRef}
            autoFocus
            bordered={false}
          />
          <BeamHighlight animate={inputClassName === 'correct'} />
          {useCountDown && (
            <Countdown
              key={resetKey}
              seconds={timerSeconds}
              onComplete={handleTimerComplete}
            />
          )}
        </div>
        <Space direction="horizontal" size={10}>
          <WordPlayer
            word={currentWord.word}
            lang={synthSpeechLang}
            autoPlay={user.trainingSettings.synthVoiceAutoStart}
            play={false}
          />
          <SpeechRecognizer
            word={currentWord.word}
            onResult={handleSpeech}
            lang={userSpeechLang}
            autoStart={user.trainingSettings.speechRecognizerAutoStart}
          />
        </Space>
        <br />
        <ActionButtons
          word={currentWord}
          onLearnedButtonClick={handleLearned}
          onNextButtonClick={handleNextButtonClick}
          showAnswer={showAnswer}
          resultingProgress={resultingProgress}
          onFinishTraining={handleFinishTraining}
        />
        <br /> <br />
        <TrainingStatus
          resultingProgress={resultingProgress}
          queue={queue}
          word={currentWord}
          totalErrorsCount={totalErrorsCount}
        />
      </>
    )
  )
}

export default TrainingInput
