import React, { useState, useEffect, useRef } from 'react'
import { Button, message } from 'antd'
import { AudioOutlined } from '@ant-design/icons'

interface SpeechRecognitionProps {
  lang: string
  onResult: (text: string) => void
  autoStart?: boolean
}

const SpeechRecognizer: React.FC<SpeechRecognitionProps> = ({
  lang,
  onResult,
  autoStart,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for browser compatibility
    if (!('webkitSpeechRecognition' in window)) {
      message.error('Your browser does not support the Web Speech API')
      return
    }

    recognitionRef.current = new window.webkitSpeechRecognition()
    recognitionRef.current.continuous = true
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
      // message.error(`Error: ${event.error}`)
      setIsListening(false)
      setTimeout(() => {
        startListening()
      }, 1000)
    }

    const startListening = () => {
      setIsListening(true)
      recognitionRef.current.start()
    }

    if (autoStart) {
      startListening()
    }

    return () => {
      recognitionRef.current.stop()
    }
  }, [autoStart, onResult])

  const handleToggle = () => {
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
    <div>
      <Button
        size="large"
        title={'распознать речь'}
        icon={<AudioOutlined />}
        onClick={handleToggle}
        type={isListening ? 'primary' : 'default'}></Button>
    </div>
  )
}

export default SpeechRecognizer
