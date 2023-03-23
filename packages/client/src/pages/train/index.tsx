import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, InputRef, message, Typography } from 'antd'
import { useAppDispatch, useAppSelector } from '../../components/hooks/store'
import Layout from '../../components/layout'
import createCn from '../../utils/create-cn'
import { UserWordProgress, Word } from '../../types/training'
import { useAuth } from '../../components/hooks/auth'
const { Title, Paragraph } = Typography

const cn = createCn('train-page')

//TODO ввод на английской раскладке
//TODO минутный таймер
//TODO первичное ознакомление со словом
//TODO эффект на не правильный ответ и верный ( + удаление первого не првильного символа
//TODO отправлять результаты тренировки на сервер порциями по 5 или менее (если осталось меньше 5)

const App = () => {
  const dispatch = useAppDispatch()
  const { training } = useAuth()
  const [userWordProgress, setUserWordProgress] = useState<UserWordProgress[]>(
    []
  )
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
  const [currentWord, setCurrentWord] = useState<Word>(
    userWordProgress[currentWordIndex]?.word || {
      id: 0,
      word: '',
      translation: '',
    }
  )
  const [translation, setTranslation] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [errorsCount, setErrorsCount] = useState<number>(0)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [lockInput, setLockInput] = useState<boolean>(false)
  const inputRef = useRef<InputRef>(null)

  // useEffect(() => {
  //   setUserWordProgress(training)
  // }, [training])

  useEffect(() => {
    setCurrentWord(
      userWordProgress[currentWordIndex]?.word || {
        id: 0,
        word: '',
        translation: '',
      }
    )
    setTranslation(userWordProgress[currentWordIndex]?.word.translation || '')
    setInputValue('')
    setErrorsCount(0)
    setShowAnswer(false)
    inputRef.current?.focus()
  }, [currentWordIndex, userWordProgress])

  const handleStartTraining = () => {
    setUserWordProgress(training)
    setCurrentWordIndex(0)
  }

  const showAnswerWord = (isRight: boolean) => {
    setShowAnswer(true)
    setInputValue(translation)
    setLockInput(true)
    //функция для отправки ответа на сервер
    setTimeout(() => {
      setLockInput(false)
      setCurrentWordIndex(currentWordIndex + 1)
    }, 2000)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    setInputValue(inputValue)

    if (inputValue.length === translation.length) {
      if (inputValue === translation) {
        showAnswerWord(true)
      } else {
        message.error('Incorrect!')
        setErrorsCount(errorsCount + 1)
        setInputValue('')
        if (errorsCount >= 2) {
          showAnswerWord(false)
        }
      }
    } else if (inputValue.length >= translation.length / 2) {
      if (currentWord.translation.startsWith(inputValue)) {
        message.success('Correct!')
        showAnswerWord(true)
      } else {
        message.error('Incorrect!')
        setErrorsCount(errorsCount + 1)
        setInputValue('')
        if (errorsCount >= 2) {
          showAnswerWord(false)
        }
      }
    }
  }

  const handleLearned = () => {
    setUserWordProgress([...userWordProgress.slice(1), userWordProgress[0]])
  }

  return (
    <Layout>
      <section className={cn('')}>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Title level={2}>Flashcard Training</Title>
          {userWordProgress.length > 0 ? (
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
              <Button type="primary" onClick={() => setShowAnswer(true)}>
                Show Answer
              </Button>{' '}
              <Button
                type="primary"
                onClick={() => setCurrentWordIndex(currentWordIndex + 1)}>
                Skip
              </Button>{' '}
              <Button type="primary" onClick={handleLearned}>
                Learned
              </Button>{' '}
              <br />
              <br />
              <Paragraph>Errors count: {errorsCount}</Paragraph>
              <Paragraph>
                Words left: {userWordProgress.length - currentWordIndex}
              </Paragraph>
            </div>
          ) : (
            <div>
              <Paragraph>
                {training.length > 0
                  ? `You have ${training.length} words to train, lets start!`
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
