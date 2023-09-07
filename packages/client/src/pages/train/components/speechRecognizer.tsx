import React, { useState, useEffect, useRef } from 'react'
import { Button, message } from 'antd'
import { AudioOutlined } from '@ant-design/icons'
import { customNotification } from '../../../components/custom-notification/customNotification'

interface SpeechRecognitionProps {
  lang: string
  onResult: (text: string) => void
  autoStart?: boolean
  isReady?: boolean
  word: string
}

const SpeechRecognizer: React.FC<SpeechRecognitionProps> = ({
  lang,
  onResult,
  autoStart,
  isReady,
  word,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for browser compatibility
    if (!('webkitSpeechRecognition' in window)) {
      customNotification({
        message: 'Ошибка!',
        description: 'Ваш браузер не поддерживает распознавание речи',
        type: 'error',
      })
      return
    }
    recognitionRef.current = new window.webkitSpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = lang

    recognitionRef.current.onresult = (event: {
      resultIndex: any
      results: string | any[]
    }) => {
      let interim_transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript(transcript)
          if (onResult) {
            onResult(transcript)
          }
        } else {
          interim_transcript += transcript
        }
      }
      setIsListening(false)
    }

    recognitionRef.current.onerror = (event: { error: any }) => {
      setIsListening(false)
    }

    const startListening = () => {
      if (!isReady) return
      recognitionRef.current.start()
      setIsListening(true)
    }

    if (autoStart) {
      startListening()
    }

    return () => {
      recognitionRef.current.stop()
    }
  }, [word])

  const handleToggle = () => {
    if (!isReady) return
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        recognitionRef.current.start()
        setIsListening(true)
      }
    }
  }

  return (
    <Button
      size="large"
      title={'распознать речь'}
      icon={<AudioOutlined />}
      onClick={handleToggle}
      disabled={!isReady}
      type={
        isReady ? (isListening ? 'primary' : 'default') : 'default'
      }></Button>
  )
}

export default SpeechRecognizer
