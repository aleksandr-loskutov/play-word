import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, InputRef, message, Typography } from 'antd'
import { useAppDispatch } from '../../components/hooks/store'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { useAuth } from '../../components/hooks/auth'
import { UserWordProgress, Word } from '../../types/training'
import { KEY_MAPPINGS } from '../../utils/training-settings'
const { Title, Paragraph } = Typography

//TODO завершение тренировки экран
//TODO ввод на английской раскладке
//TODO минутный таймер
//TODO эффект на не правильный ответ и верный ( + удаление первого не првильного символа
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
    console.log('setNextWord word=', word)
    if (word.sessionStage > 2) {
      console.log(
        'тренировка завершена т.к достигли слова со статусом sessionStage 3'
      )
      setFinishTraining()
      return
    }
    if (word.sessionStage === 0) {
      console.log('первая тренировка')
      setShowAnswer(true)
    }
    if (word.sessionStage === 2) {
      console.log('russian - english тренировка')
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
    setTimeout(() => {
      setLockInput(false)
      isUserAnswerCorrect(isCorrect)
    }, 2000)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    setInputValue(inputValue)

    if (inputValue === translation) {
      showAnswerWord(true)
    } else if (inputValue.length >= translation.length / 2) {
      if (currentWord.translation.startsWith(inputValue)) {
        message.success('Correct!')
        showAnswerWord(true)
      } else {
        message.error('Incorrect!')
        setErrorsCount(errorsCount + 1)
        setInputValue('')
        if (errorsCount + 1 >= 2) {
          showAnswerWord(false)
        }
      }
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase()
      console.log('pressedKey=', event.code)
      const translationChar = translation.charAt(inputValue.length)

      if (
        inputValue.length < translation.length &&
        KEY_MAPPINGS.hasOwnProperty(pressedKey) &&
        KEY_MAPPINGS[pressedKey].hasOwnProperty(translationChar) &&
        KEY_MAPPINGS[pressedKey][translationChar] === translationChar
      ) {
        setInputValue(prevInputValue => prevInputValue + pressedKey)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [inputValue, translation])

  const handleLearned = () => {
    isUserAnswerCorrect(true)
  }

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
                placeholder="Enter translation"
                value={inputValue}
                onChange={handleInputChange}
                disabled={lockInput}
                className={cn('input')}
                ref={inputRef}
                autoFocus
              />
              <br />
              <br />
              {showAnswer && currentWord.sessionStage === 0 ? (
                <Button type="primary" onClick={handleLearned}>
                  Запомнил
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
