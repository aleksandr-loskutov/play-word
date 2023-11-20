import { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

type SpeechRecognitionProps = {
  lang: string;
  onResult: (text: string) => void;
  autoStart?: boolean;
  isReady?: boolean;
  word: string;
};

const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window;

function SpeechRecognizer({
  lang,
  onResult,
  autoStart,
  isReady,
  word,
}: SpeechRecognitionProps): React.ReactElement {
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<typeof window.webkitSpeechRecognition>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
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
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const { transcript } = event.results[i][0];
        if (event.results[i].isFinal) {
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
  const title = isSpeechRecognitionSupported
    ? `распознать речь`
    : 'распознавание речи не поддерживается вашим браузером';

  return (
    <Button
      size="large"
      title={title}
      icon={<AudioOutlined />}
      onClick={handleToggle}
      disabled={!isSpeechRecognitionSupported || !isReady}
      type={buttonType}
    />
  );
}

SpeechRecognizer.defaultProps = {
  autoStart: false,
  isReady: false,
};

export default SpeechRecognizer;
