import React, { useState, useEffect, useRef } from 'react'
import './styles.css'
import { Button, Input, InputRef, message, Typography } from 'antd'
import { useAppDispatch } from '../../components/hooks/store'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAuth } from '../../components/hooks/auth'
import { UserWordProgress, Word } from '../../types/training'
import { KEY_MAPPINGS, TRAINING_SETTINGS } from '../../utils/training-settings'
const { Title, Paragraph } = Typography
const { wordErrorLimit, successWordShowTime, errorLetterShowTime } =
  TRAINING_SETTINGS

//TODO визуально подсвечивать инпут в зависимости от ответа
//TODO минутный таймер
//TODO отправлять результаты тренировки на сервер  ( опционаьно - порциями по 5 или менее (если осталось меньше 5))

const cn = createCn('train-page')

const App = () => {
  const dispatch = useAppDispatch()
  const { training } = useAuth()
  const [userWordProgress, setUserWordProgress] = useState<UserWordProgress[]>(
    []
  )

  console.log('userWordProgress', userWordProgress)
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
  const [errorsCount, setErrorsCount] = useState<number>(0)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [lockInput, setLockInput] = useState<boolean>(false)
  const inputRef = useRef<InputRef>(null)

  const prepareTrainingArray = (): UserWordProgress[] => {
    return training.map(wordProgress => ({
      ...wordProgress,
      word: {
        ...wordProgress.word,
        sessionStage: wordProgress.stage === 0 ? 0 : 1,
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

        if (a.word.sessionStage === b.word.sessionStage) {
          return nextReviewA.getTime() - nextReviewB.getTime()
        }
        return a.word.sessionStage - b.word.sessionStage
      })
    } else {
      //sort by sessionStage current progress for regular sorting after each answer
      sortedProgressArray = progressArray.sort(
        (a, b) => a.word.sessionStage - b.word.sessionStage
      )
    }
    return sortedProgressArray
  }

  useEffect(() => {
    if (userWordProgress.length > 0) nextWordTrain()
  }, [userWordProgress])

  const nextWordTrain = () => {
    setShowAnswer(false)
    setInputValue('')
    setErrorsCount(0)
    inputRef.current?.focus()
    setNextWord()
  }
  const setFinishTraining = () => {
    //отправляем результаты тренировки
    //скрываем стейты слов и инпут
    setUserWordProgress([])
    //показать статистику - новых слов изучено, ошибок сделано, времени прошло
    //кнопка перезагрузки страницы
  }

  const setNextWord = () => {
    //take first word from userWordProgress
    let word = userWordProgress[0].word
    if (word.sessionStage > 2) {
      console.log(
        'тренировка завершена т.к достигли слова со статусом sessionStage 3'
      )
      setFinishTraining()
      return
    }
    if (word.sessionStage === 0) {
      setShowAnswer(true)
    }
    if (word.sessionStage === 2) {
      //reverse for russian - english
      word = reverseWordAndTranslation(word)
    }
    setCurrentWord(word)
    setTranslation(word.translation)
  }

  const reverseWordAndTranslation = (word: Word): Word => {
    return { ...word, word: word.translation, translation: word.word }
  }

  const handleStartTraining = () => {
    setUserWordProgress(sortUserWordProgress())
  }

  const isUserAnswerCorrect = (isCorrect: boolean): void => {
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
      //moving first element to the end of the training queue
      setUserWordProgress(prevUserWordProgress => {
        const [firstWordProgress, ...restWordProgress] = prevUserWordProgress
        const updatedProgress = [...restWordProgress, firstWordProgress]
        return sortUserWordProgress(updatedProgress)
      })
    }
  }

  const showAnswerWord = (isCorrect: boolean) => {
    setShowAnswer(true)
    setInputValue(translation)
    setLockInput(true)
    setErrorsCount(0)
    setTimeout(() => {
      setLockInput(false)
      isUserAnswerCorrect(isCorrect)
    }, successWordShowTime)
  }

  const correctAnswer = () => {
    message.success('Correct!')
    showAnswerWord(true)
  }

  const incorrectAnswer = () => {
    message.error('Incorrect!')
    if (errorsCount + 1 >= wordErrorLimit) {
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
        if (errorsCount >= wordErrorLimit) {
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (lockInput) return
      const pressedKey = event.key.toLowerCase()
      if (pressedKey === 'backspace') {
        backspaceEmulation()
        return
      }
      const keyCode = event.code
      console.log('pressedKey=', pressedKey)
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
          setErrorsCount(errorsCount + 1)
          if (errorsCount >= wordErrorLimit) {
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
    isUserAnswerCorrect(true)
  }

  const inputClassName = !lockInput
    ? ''
    : showAnswer && inputValue === translation
    ? 'correct'
    : 'incorrect'

  return (
    <Layout>
      <section className={cn('')}>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Title level={2}>Flashcard Training</Title>
          {userWordProgress.length > 0 && currentWord.word ? (
            <div>
              <Paragraph>Translate the word:</Paragraph>
              <Title level={3}>{currentWord.word}</Title>
              {showAnswer && (
                <div>
                  <Paragraph>The correct translation is:</Paragraph>
                  <Title level={3}>{currentWord.translation}</Title>
                </div>
              )}
              <Input
                placeholder="введите перевод"
                value={inputValue}
                disabled={lockInput}
                className={cn(`train-input ${inputClassName}`)}
                ref={inputRef}
                autoFocus
              />
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
              <Paragraph>Errors count: {errorsCount}</Paragraph>
              <Paragraph>Words left: {userWordProgress.length}</Paragraph>
            </div>
          ) : (
            <div>
              <Paragraph>
                {training.length > 0
                  ? `You have ${training.length} words to train, let's start!`
                  : 'You have no words to train yet. Add some in the dashboard!'}
              </Paragraph>
              {training.length > 0 && (
                <Button type="primary" onClick={handleStartTraining}>
                  Start Training
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default App
