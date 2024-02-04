import React, { useState, useEffect, useRef } from 'react';
import { Col, Input, InputRef, Row, Space } from 'antd';
import type { UserWordProgress, WordStats } from '../../../types/training';
import {
  KEY_MAPPINGS,
  TRAINING_SETTINGS,
} from '../../../utils/training-settings';
import createCn from '../../../utils/create-cn';
import { useAuth } from '../../../components/hooks/auth';
import SpeechRecognizer from './speechRecognizer';
import WordPlayer from './wordPlayer';
import {
  ActionButtons,
  Countdown,
  TrainingStatus,
  useQueue,
  WordWithTooltip,
} from './index';
import { getWordStats } from '../utils';
import useScreenSize from '../../../components/hooks/screenSize';
import VirtualKeyboard from './virtualKeyboard';
import getKeycode from '../../../utils/get-keycode';

const { successWordShowTime, errorLetterShowTime } = TRAINING_SETTINGS;

type InputProps = {
  initialQueue: UserWordProgress[];
  onFinish: (
    resultingProgress: UserWordProgress[],
    trainingStats: WordStats[]
  ) => void;
};

const cn = createCn('train-page');

function TrainingInput({
  initialQueue,
  onFinish,
}: InputProps): React.ReactElement | null {
  const [inputValue, setInputValue] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [lockInput, setLockInput] = useState<boolean>(false);
  const [mistypeCount, setMistypeCount] = useState<number>(0);
  const [resetKey, setResetKey] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const inputRef = useRef<InputRef>(null);
  const isSpeechRecognizerSetInput = useRef<boolean>(false);
  const { user, isLoading, isLoadingTraining } = useAuth();
  const {
    queue,
    setQueue,
    peekQueue,
    resultingProgress,
    word: currentWord,
    isEmptyQueue,
    clearQueue,
    processQueueByAnswer,
  } = useQueue();
  const isZeroStage = currentWord?.sessionStage === 0;
  const isLoaded = user && currentWord && !isLoading && !isLoadingTraining;
  const { isMobile } = useScreenSize();

  useEffect(() => {
    if (initialQueue.length > 0 && isEmptyQueue()) {
      setQueue(initialQueue);
    }
  }, [initialQueue]);

  const handleFinishTraining = () => {
    if (resultingProgress.length > 0 && user) {
      onFinish(
        resultingProgress,
        getWordStats(resultingProgress, user.trainingSettings)
      );
      clearQueue();
    }
  };

  useEffect(() => {
    if (isEmptyQueue() && resultingProgress.length > 0) {
      handleFinishTraining();
    }
  }, [queue.length]);

  useEffect(() => {
    if (isLoaded) {
      setTimerSeconds(user.trainingSettings.countdownTimeInSec);
    }
  }, [isLoaded]);

  const trainWord = () => {
    const isShowAnswer = isZeroStage || showAnswer;
    setShowAnswer(isShowAnswer);
    setInputValue(isShowAnswer ? currentWord?.translation : '');
    setMistypeCount(0);
    inputRef.current?.focus();

    setLockInput(isShowAnswer);
  };

  useEffect(() => {
    if (currentWord) {
      trainWord();
    }
  }, [currentWord]);

  const useCountDown = !!(
    user &&
    user.trainingSettings.useCountdown &&
    !isZeroStage &&
    !showAnswer
  );

  const restartTimer = () => {
    if (!user) return;
    setTimerSeconds(user.trainingSettings.countdownTimeInSec);
    // Update resetKey to trigger Countdown component reset
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleAnswer = (isCorrect: boolean) => {
    // isCorrect ? message.success('Ok!') : message.error('Incorrect!')
    const { wordErrorLimit } = user?.trainingSettings ?? { wordErrorLimit: 3 };
    processQueueByAnswer(isCorrect, wordErrorLimit);
  };

  const processAnswer = (isCorrect: boolean) => {
    setLockInput(true);
    setInputValue(currentWord.translation);
    setShowAnswer(true);
    setMistypeCount(0);
    // таймаут не нужен если первое касание со словом
    const timeout = currentWord.sessionStage === 0 ? 0 : successWordShowTime;
    setTimeout(() => {
      setLockInput(false);
      setShowAnswer(false);
      if (useCountDown) restartTimer();
      handleAnswer(isCorrect);
    }, timeout);
  };

  const handleLearned = () => {
    handleAnswer(true);
    setShowAnswer(false);
  };
  const restoreCorrectInputValue = () => {
    setInputValue((prevInputValue) => {
      const correctInputValue = prevInputValue
        .split('')
        .filter((char, index) => {
          const translationChar = currentWord.translation.charAt(index);
          return char === translationChar;
        })
        .join('');
      return correctInputValue;
    });

    setLockInput(false);
    inputRef?.current?.focus();
  };
  const setIncorrectTemporaryInputValue = (character: string) => {
    setLockInput(true);
    setInputValue((prevInputValue) => {
      const newInputValue = prevInputValue + character;
      setTimeout(() => {
        restoreCorrectInputValue();
      }, errorLetterShowTime);

      return newInputValue;
    });
  };

  const handleSpeech = (text: string) => {
    isSpeechRecognizerSetInput.current = true;
    setInputValue(text.toLowerCase());
  };

  const processIncorrectInput = (incorrectChar: string) => {
    setMistypeCount((prevMistypeCount) => prevMistypeCount + 1);
    if (user && mistypeCount >= user.trainingSettings.wordMistypeLimit) {
      processAnswer(false);
      return;
    }
    if (isSpeechRecognizerSetInput.current) {
      setIncorrectTemporaryInputValue(incorrectChar);
      return;
    }
    if (inputValue.length < currentWord.translation.length) {
      setIncorrectTemporaryInputValue(incorrectChar);
    }
  };

  const validateInput = () => {
    if (inputValue === currentWord.translation) {
      processAnswer(true);
    } else if (inputValue.length >= currentWord.translation.length / 2) {
      if (currentWord.translation.startsWith(inputValue)) {
        processAnswer(true);
      } else {
        // incorrect input from speech recognizer
        processIncorrectInput('');
      }
    }
  };

  const backspaceEmulation = () => {
    setInputValue((prevInputValue) => {
      if (prevInputValue.length === 0) {
        return prevInputValue;
      }

      return prevInputValue.slice(0, -1);
    });
  };

  const handleNextButtonClick = () => {
    processAnswer(false);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();
    let keyCode: string | undefined = event.code;
    if (keyCode === '') {
      keyCode = getKeycode(pressedKey);
    }
    if (!keyCode) return;

    if (keyCode === 'Backspace' && !lockInput) {
      backspaceEmulation();
      return;
    }
    if (keyCode === 'Space') {
      event.preventDefault();
    }

    if (lockInput) return;

    if (Object.prototype.hasOwnProperty.call(KEY_MAPPINGS, keyCode)) {
      const keyMappings = Object.entries(KEY_MAPPINGS[keyCode])[0];
      const translationChar = currentWord.translation.charAt(inputValue.length);

      if (keyMappings.includes(translationChar)) {
        setInputValue((prevInputValue) => prevInputValue + translationChar);
        validateInput();
      } else {
        let switchedIncorrectCharacterByLang = pressedKey;
        // подмена ввода ( для ошибочных букв  с неверной раскладкой)
        if (keyMappings.includes(pressedKey)) {
          if (currentWord.sessionStage === 1) {
            [, switchedIncorrectCharacterByLang] = keyMappings;
          }
          if (currentWord.sessionStage === 2) {
            [switchedIncorrectCharacterByLang] = keyMappings;
          }
        }
        processIncorrectInput(switchedIncorrectCharacterByLang);
      }
    }
  };

  useEffect(() => {
    if (isSpeechRecognizerSetInput.current) {
      validateInput();
    }

    inputRef?.current?.focus();
    document.addEventListener('keydown', handleKeyPress);
    isSpeechRecognizerSetInput.current = false;
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [inputValue, currentWord]);

  const handleTimerComplete = () => {
    processAnswer(false);
  };

  const userSpeechLang = currentWord?.sessionStage === 1 ? 'ru-RU' : 'en-US';
  const synthSpeechLang = currentWord?.sessionStage <= 1 ? 'en-US' : 'ru-RU';

  const getInputClassName = () => {
    if (!lockInput) {
      return '';
    }
    if (showAnswer && inputValue === currentWord?.translation) {
      return 'correct';
    }
    return 'incorrect';
  };

  const inputClassName = getInputClassName();

  const useSpeechRecognizer = !isZeroStage && !showAnswer;

  const getTrainingStats = (): WordStats[] => {
    if (!user || resultingProgress.length === 0) return [];
    return getWordStats(resultingProgress, user.trainingSettings);
  };

  const getTotalErrorsCount = (): number => {
    const errorsFromResultingProgress = getTrainingStats().reduce(
      (accumulator, word) => accumulator + word.errorCounter,
      0
    );
    const errorsFromQueue = queue.reduce(
      (accumulator, word) => accumulator + word.word.errorCounter,
      0
    );
    return errorsFromResultingProgress + errorsFromQueue;
  };

  const totalErrorsCount =
    user && resultingProgress.length === 0 ? getTotalErrorsCount() : 0;

  const collectionName = peekQueue()?.collectionName;
  const isWordNew = peekQueue()?.stage === 0;

  return isLoaded ? (
    <Row className={cn('input-components-row')} gutter={[20, 20]}>
      <Col span={24}>
        <WordWithTooltip
          word={currentWord.word}
          collectionName={collectionName}
          showCollectionNameHint={user.trainingSettings.showCollectionNameHint}
          isWordNew={isWordNew}
        />
      </Col>
      <Col span={24}>
        <div className={cn(`train-input-box`)}>
          <Input
            placeholder="перевод"
            value={inputValue}
            disabled={lockInput}
            className={cn(`train-input ${inputClassName}`)}
            ref={inputRef}
            bordered={false}
            readOnly
          />
          {useCountDown && (
            <Countdown
              key={resetKey}
              seconds={timerSeconds}
              onComplete={handleTimerComplete}
            />
          )}
        </div>
      </Col>
      {isMobile && !isZeroStage && (
        <Col span={24}>
          <div className={cn(`virtual-keyboard-box`)}>
            <VirtualKeyboard
              word={currentWord.translation}
              inputValue={inputValue}
            />
          </div>
        </Col>
      )}
      <Col span={24}>
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
            isReady={useSpeechRecognizer}
          />
        </Space>
      </Col>
      <Col span={24}>
        <ActionButtons
          word={currentWord}
          onLearnedButtonClick={handleLearned}
          onNextButtonClick={handleNextButtonClick}
          showAnswer={showAnswer}
          resultingProgress={resultingProgress}
          onFinishTraining={handleFinishTraining}
        />
      </Col>
      <Col span={24}>
        <TrainingStatus
          resultingProgress={resultingProgress}
          queue={queue}
          word={currentWord}
          totalErrorsCount={totalErrorsCount}
        />
      </Col>
    </Row>
  ) : null;
}

export default TrainingInput;
