import React, { useState, useEffect, useRef } from 'react'
import { Input, InputRef, Space } from 'antd'
import { WordInTraining } from '../../../types/training'
import {
  KEY_MAPPINGS,
  TRAINING_SETTINGS,
} from '../../../utils/training-settings'
import createCn from '../../../utils/create-cn'
import { useAuth } from '../../../components/hooks/auth'
import SpeechRecognizer from './speechRecognizer'
import WordPlayer from './wordPlayer'
import { Countdown } from './index'
const { successWordShowTime, errorLetterShowTime, countdownVisualBlocksLimit } =
  TRAINING_SETTINGS

type InputProps = {
  currentWord: WordInTraining
  onAnswer: (answer: boolean) => void
  showAnswer: boolean
  setShowAnswer: (showAnswer: boolean) => void
  isNextButtonClicked: boolean
}

const cn = createCn('train-page')

const TrainingInput: React.FC<InputProps> = ({
  currentWord,
  onAnswer,
  showAnswer,
  setShowAnswer,
  isNextButtonClicked,
}) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [lockInput, setLockInput] = useState<boolean>(false)
  const [mistypeCount, setMistypeCount] = useState<number>(0)
  const [resetKey, setResetKey] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const inputRef = useRef<InputRef>(null)
  const isSpeechRecognizerSetInput = useRef<boolean>(false)
  const { user, isLoading, training, isLoadingTraining } = useAuth()
  const isZeroStage = currentWord.sessionStage === 0
  const isLoaded = user && !isLoading && !isLoadingTraining

  useEffect(() => {
    if (currentWord) {
      trainWord()
    }
  }, [currentWord])

  useEffect(() => {
    if (isLoaded) {
      setTimerSeconds(user.trainingSettings.countdownTimeInSec)
    }
  }, [isLoaded])

  useEffect(() => {
    if (isNextButtonClicked) {
      processAnswer(false)
    }
  }, [isNextButtonClicked])

  const trainWord = () => {
    const isShowAnswer = isZeroStage || showAnswer
    setShowAnswer(isShowAnswer)
    setInputValue(isShowAnswer ? currentWord.translation : '')
    setMistypeCount(0)
    inputRef.current?.focus()

    setLockInput(isShowAnswer)
  }

  const processAnswer = (isCorrect: boolean) => {
    setShowAnswer(true)
    setInputValue(currentWord.translation)
    setLockInput(true)
    setMistypeCount(0)
    //таймаут не нужен если первое касание со словом
    const timeout = currentWord.sessionStage === 0 ? 0 : successWordShowTime
    setTimeout(() => {
      setLockInput(false)
      setShowAnswer(false)
      if (useCountDown) restartTimer()
      onAnswer(isCorrect)
    }, timeout)
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
    console.log('speech', text)
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
        processIncorrectInput()
      }
    }
  }

  const processIncorrectInput = () => {
    if (user && mistypeCount >= user.trainingSettings.wordMistypeLimit) {
      processAnswer(false)
    } else if (isSpeechRecognizerSetInput.current) {
      setMistypeCount(prevState => prevState + 1)
      setIncorrectTemporaryInputValue('')
    }
  }

  useEffect(() => {
    if (isSpeechRecognizerSetInput.current) {
      validateInput()
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
      if (keyCode === 'Enter') {
        validateInput()
        return
      }

      if (lockInput) return

      if (KEY_MAPPINGS.hasOwnProperty(keyCode)) {
        const keyMappings = Object.entries(KEY_MAPPINGS[keyCode])[0]
        const translationChar = currentWord.translation.charAt(
          inputValue.length
        )

        if (
          inputValue.length < currentWord.translation.length &&
          keyMappings.includes(translationChar)
        ) {
          setInputValue(prevInputValue => prevInputValue + translationChar)
          validateInput()
        } else {
          setMistypeCount(prevMistypeCount => prevMistypeCount + 1)
          processIncorrectInput()

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
          setIncorrectTemporaryInputValue(switchedIncorrectCharacterByLang)
        }
      }
    }
    inputRef?.current?.focus()
    document.addEventListener('keydown', handleKeyPress)
    isSpeechRecognizerSetInput.current = false
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [inputValue])

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

  const userSpeechLang = currentWord.sessionStage === 1 ? 'ru-RU' : 'en-US'
  const synthSpeechLang = currentWord.sessionStage === 1 ? 'en-US' : 'ru-RU'

  const inputClassName = !lockInput
    ? ''
    : showAnswer && inputValue === currentWord.translation
    ? 'correct'
    : 'incorrect'

  const useCountDown = !!(
    user &&
    user.trainingSettings.useCountdown &&
    currentWord?.sessionStage !== 0
  )

  return (
    isLoaded && (
      <>
        <Input
          placeholder="перевод"
          value={inputValue}
          disabled={lockInput}
          className={cn(`train-input ${inputClassName}`)}
          ref={inputRef}
          autoFocus
        />
        {useCountDown && (
          <Countdown
            key={resetKey}
            seconds={timerSeconds}
            onComplete={handleTimerComplete}
            maxBlocks={countdownVisualBlocksLimit}
          />
        )}
        <Space direction="horizontal" size={10}>
          <WordPlayer
            word={currentWord.word}
            lang={synthSpeechLang}
            autoPlay={user.trainingSettings.synthVoiceAutoStart}
            play={false}
          />
          <SpeechRecognizer
            onResult={handleSpeech}
            lang={userSpeechLang}
            autoStart={user.trainingSettings.speechRecognizerAutoStart}
          />
        </Space>
      </>
    )
  )
}

export default TrainingInput
