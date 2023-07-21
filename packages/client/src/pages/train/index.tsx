import React, { useState, useEffect, useRef } from 'react'
import './styles.css'
import { Button, Input, InputRef, message, Typography } from 'antd'
import { useAppDispatch } from '../../components/hooks/store'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAuth } from '../../components/hooks/auth'
import { UserWordProgress, Word } from '../../types/training'
import { KEY_MAPPINGS, TRAINING_SETTINGS } from '../../utils/training-settings'
import Countdown from './components/countdown'
import { updateTraining } from '../../store/action-creators/training'
import { transformUserProgressToUpdateRequest } from '../../utils/transform-user-progress'
import PageLoader from '../../components/page-loader'
const { Title, Paragraph } = Typography
const { successWordShowTime, errorLetterShowTime, countdownVisualBlocksLimit } =
  TRAINING_SETTINGS

const cn = createCn('train-page')

const TrainPage = () => {
  const dispatch = useAppDispatch()
  const { user, isLoading, error, training, isLoadingTraining } = useAuth()
  const [userWordProgress, setUserWordProgress] = useState<UserWordProgress[]>(
    []
  )
  const [currentWord, setCurrentWord] = useState<Word>(
    userWordProgress[0]?.word || {
      id: 0,
      word: '',
      translation: '',
      sessionStage: 0,
    }
  )
  const [translation, setTranslation] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [mistypeCount, setMistypeCount] = useState<number>(0)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [lockInput, setLockInput] = useState<boolean>(false)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const [resetKey, setResetKey] = useState(0)
  const inputRef = useRef<InputRef>(null)
  const isLoaded = user && !isLoading && !isLoadingTraining

  useEffect(() => {
    if (isLoaded) setTimerSeconds(user.trainingSettings.countdownTimeInSec)
  }, [isLoaded])

  useEffect(() => {
    if (userWordProgress.length > 0) nextWordTrain()
  }, [userWordProgress])

  const finishTraining = () => {
    //отправляем результаты тренировки
    setUserWordProgress([])
    let actualUserWordProgress: UserWordProgress[] = []
    dispatch(
      updateTraining(transformUserProgressToUpdateRequest(userWordProgress))
    )
      .unwrap()
      .then(userWordProgressFromServer => {
        actualUserWordProgress = userWordProgressFromServer
        console.log('freshUserWordProgress', userWordProgressFromServer)
        message.success('Успешно сохранили тренировку!')
      })
      .catch((error: any) => {
        message.error(
          error.message || 'Не удалось сохранить прогресс тренировки'
        )
      })
  }

  const handleTimerComplete = () => {
    clickNextButton()
  }

  const restartTimer = () => {
    if (!user) return
    setTimerSeconds(user.trainingSettings.countdownTimeInSec)
    // Update resetKey to trigger Countdown component reset
    setResetKey(prevKey => prevKey + 1)
  }

  const prepareTrainingArray = (): UserWordProgress[] => {
    return training.map(wordProgress => ({
      ...wordProgress,
      word: {
        ...wordProgress.word,
        sessionStage: wordProgress.stage === 0 ? 0 : 1,
        errorCounter: 0,
      },
    }))
  }

  const sortUserWordProgress = (
    progressArray: UserWordProgress[] = []
  ): UserWordProgress[] => {
    let sortedProgressArray = []
    //sort for initial only (pushed start training button)
    if (progressArray.length === 0) {
      sortedProgressArray = prepareTrainingArray().sort((a, b) => {
        const nextReviewA = new Date(a.nextReview)
        const nextReviewB = new Date(b.nextReview)

        // if (a.word.sessionStage === b.word.sessionStage) {
        return nextReviewA.getTime() - nextReviewB.getTime()
        // }
        // return a.word.sessionStage - b.word.sessionStage
      })
    } else {
      // regular sorting after each answer of current progress by sessionStage
      sortedProgressArray = progressArray.sort(
        (a, b) => a.word.sessionStage - b.word.sessionStage
      )
      sortedProgressArray = progressArray
    }
    return sortedProgressArray
  }

  const nextWordTrain = () => {
    setShowAnswer(false)
    setInputValue('')
    setMistypeCount(0)
    inputRef.current?.focus()
    setNextWord()
    restartTimer()
  }

  const setNextWord = () => {
    //проверить весь массив на стейдж - возможно тренировка закончилась
    //take first word from userWordProgress
    let word = userWordProgress[0].word
    if (word.sessionStage > 2) {
      console.log(
        'тренировка завершена т.к достигли слова со статусом sessionStage 3'
      )
      finishTraining()
      return
    }
    if (word.sessionStage === 0) {
      setShowAnswer(true)
      setInputValue(word.translation)
    }
    //reverse for russian - english
    if (word.sessionStage === 2) {
      word = reverseWordAndTranslation(word)
    }
    setCurrentWord(word)
    setTranslation(word.translation)
    word.sessionStage === 0 ? setLockInput(true) : setLockInput(false)
  }

  const reverseWordAndTranslation = (word: Word): Word => {
    return { ...word, word: word.translation, translation: word.word }
  }

  const handleStartTraining = () => {
    if (!user) return
    const sortedAndSlicedProgress = sortUserWordProgress().slice(
      0,
      user.trainingSettings.wordsPerSession
    )
    setUserWordProgress(sortedAndSlicedProgress)
  }

  const processUserAnswer = (isCorrect: boolean): void => {
    if (isCorrect) {
      //moving first element to the end of the training queue and making + 1 to the stage
      setUserWordProgress(prevUserWordProgress => {
        const [firstWordProgress, ...restWordProgress] = prevUserWordProgress
        const updatedProgress = [
          ...restWordProgress,
          {
            ...firstWordProgress,
            word: {
              ...firstWordProgress.word,
              sessionStage: firstWordProgress.word.sessionStage + 1,
            },
          },
        ]
        return sortUserWordProgress(updatedProgress)
      })
    } else {
      //user made a mistake
      setUserWordProgress(prevUserWordProgress => {
        const [currentWordProgress, ...restWordProgress] = prevUserWordProgress
        const { sessionStage: currentSessionStage, errorCounter } =
          currentWordProgress.word
        const wordErrors = errorCounter + 1
        //if we already reached user error limit, we set word stage to 3 (finished) so it will never show again in this session coz of regular sortUserWordProgress
        const sessionStage =
          wordErrors >= user.trainingSettings.wordErrorLimit
            ? 3
            : currentSessionStage
        const updatedProgress = [
          ...restWordProgress,
          {
            ...currentWordProgress,
            word: {
              ...currentWordProgress.word,
              sessionStage,
              errorCounter: wordErrors,
            },
          },
        ]
        return sortUserWordProgress(updatedProgress)
      })
    }
  }

  const showAnswerWord = (isCorrect: boolean) => {
    setShowAnswer(true)
    setInputValue(translation)
    setLockInput(true)
    setMistypeCount(0)
    setTimeout(() => {
      setLockInput(false)
      processUserAnswer(isCorrect)
    }, successWordShowTime)
  }

  const correctAnswer = () => {
    message.success('Correct!')
    showAnswerWord(true)
  }

  const incorrectAnswer = () => {
    message.error('Incorrect!')
    if (user && mistypeCount + 1 >= user.trainingSettings.wordMistypeLimit) {
      showAnswerWord(false)
    }
  }

  const validateInput = () => {
    if (inputValue === translation) {
      correctAnswer()
    } else if (inputValue.length >= translation.length / 2) {
      if (currentWord.translation.startsWith(inputValue)) {
        correctAnswer()
      } else {
        if (user && mistypeCount >= user.trainingSettings.wordMistypeLimit) {
          incorrectAnswer()
        }
      }
    }
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
          const translationChar = translation.charAt(index)
          return char === translationChar
        })
        .join('')
      return correctInputValue
    })

    setLockInput(false)
    inputRef?.current?.focus()
  }

  const backspaceEmulation = () => {
    setInputValue(prevInputValue => {
      if (prevInputValue.length === 0) {
        return prevInputValue
      }

      return prevInputValue.slice(0, -1)
    })
  }

  const clickNextButton = () => {
    userWordProgress.length === 0
      ? handleStartTraining()
      : currentWord.sessionStage === 0
      ? handleLearned()
      : showAnswerWord(false)
  }

  useEffect(() => {
    if (!isLoaded) return

    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase()
      const keyCode = event.code
      if (keyCode === 'Backspace') {
        backspaceEmulation()
        return
      }
      if (keyCode === 'Enter' || keyCode === 'Space') {
        clickNextButton()
        return
      }
      if (lockInput) return
      console.log('pressedKey=', keyCode)

      if (KEY_MAPPINGS.hasOwnProperty(keyCode)) {
        const keyMappings = Object.entries(KEY_MAPPINGS[keyCode])[0]
        const translationChar = translation.charAt(inputValue.length)
        if (
          inputValue.length < translation.length &&
          keyMappings.includes(translationChar)
        ) {
          setInputValue(prevInputValue => prevInputValue + translationChar)
          validateInput()
        } else {
          //счетчик тихих ошибок (от подбора на клаве)
          setMistypeCount(mistypeCount + 1)
          if (mistypeCount >= user.trainingSettings.wordMistypeLimit) {
            incorrectAnswer()
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
            setIncorrectTemporaryInputValue(switchedIncorrectCharacterByLang)
          }
        }
      }
    }
    inputRef?.current?.focus()
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [inputValue, translation])

  const handleLearned = () => {
    message.success('Learned!')
    processUserAnswer(true)
  }

  const inputClassName = !lockInput
    ? ''
    : showAnswer && inputValue === translation
    ? 'correct'
    : 'incorrect'

  const useCountDown = user && user.trainingSettings.useCountdown

  return (
    <Layout>
      <section className={cn('')}>
        {/*<Title level={3}>Тренировка</Title>*/}
        {isLoaded ? (
          <div style={{ textAlign: 'center', marginTop: 5 }}>
            {userWordProgress.length > 0 && currentWord.word ? (
              <div style={{ marginTop: 60 }}>
                <Title level={1}>{currentWord.word.toUpperCase()}</Title>
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
                <br />
                <br />
                {showAnswer && currentWord.sessionStage === 0 ? (
                  <Button type="primary" onClick={handleLearned}>
                    Далее
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => showAnswerWord(false)}
                    disabled={showAnswer}>
                    Показать перевод
                  </Button>
                )}{' '}
                <br />
                <br />
                <Paragraph>Ошибок: {mistypeCount}</Paragraph>
                <Paragraph>Слов: {userWordProgress.length}</Paragraph>
              </div>
            ) : (
              <div>
                <Paragraph>
                  {training.length > 0
                    ? `У вас ${training.length} слов для повторения, давайте начнем!`
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
