import { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import customNotification from '../../../components/custom-notification/customNotification';

type SpeechRecognitionProps = {
  lang: string;
  onResult: (text: string) => void;
  autoStart?: boolean;
  isReady?: boolean;
  word: string;
};

function SpeechRecognizer({
  lang,
  onResult,
  autoStart,
  isReady,
  word,
}: SpeechRecognitionProps): React.ReactElement {
  const [isListening, setIsListening] = useState<boolean>(false);
  // const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<typeof window.webkitSpeechRecognition>(null);

  useEffect(() => {
    // Check for browser compatibility
    if (!('webkitSpeechRecognition' in window)) {
      customNotification({
        message: 'Ошибка!',
        description: 'Ваш браузер не поддерживает распознавание речи',
        type: 'error',
      });
      return;
    }
    // eslint-disable-next-line new-cap
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = lang;

    recognitionRef.current.onresult = (event: {
      resultIndex: any;
      results: string | any[];
    }) => {
      // let interim_transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const { transcript } = event.results[i][0];
        if (event.results[i].isFinal) {
          // setTranscript(transcript);
          // setTranscript((prevTranscript) => prevTranscript + ' ' + transcript);
          if (onResult) {
            onResult(transcript);
          }
        }
      }
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };

    const startListening = () => {
      if (!isReady) return;
      recognitionRef.current.start();
      setIsListening(true);
    };

    if (autoStart) {
      startListening();
    }

    // eslint-disable-next-line consistent-return
    return () => {
      recognitionRef.current.stop();
    };
  }, [word]);

  const handleToggle = () => {
    if (!isReady) return;
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  let buttonType:
    | 'default'
    | 'primary'
    | 'link'
    | 'text'
    | 'ghost'
    | 'dashed'
    | undefined;

  if (isReady) {
    buttonType = isListening ? 'primary' : 'default';
  }

  return (
    <Button
      size="large"
      title="распознать речь"
      icon={<AudioOutlined />}
      onClick={handleToggle}
      disabled={!isReady}
      type={buttonType}
    />
  );
}

SpeechRecognizer.defaultProps = {
  autoStart: false,
  isReady: false,
};

export default SpeechRecognizer;
