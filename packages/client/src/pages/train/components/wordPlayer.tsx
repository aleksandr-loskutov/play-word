import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

type WordPlayerProps = {
  word: string;
  lang: string;
  autoPlay: boolean;
  play: boolean;
};

const WordPlayer: React.FC<WordPlayerProps> = ({
  word,
  lang,
  autoPlay,
  play,
}) => {
  const lastWordRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayWord = () => {
    setIsPlaying(true);
    pronounceWord();
  };

  const pronounceWord = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang;
    utterance.onend = () => setIsPlaying(false); // Set isPlaying to false when pronunciation ends
    synth.speak(utterance);
  };

  useEffect(() => {
    if (play) {
      handlePlayWord();
    }
  }, [play]);

  useEffect(() => {
    if (autoPlay && lastWordRef.current !== word) {
      handlePlayWord();
      lastWordRef.current = word;
    }
  }, [word, autoPlay]);

  return (
    <Button
      size="large"
      title={'Воспроизвести'}
      icon={<SoundOutlined />}
      onClick={handlePlayWord}
      type={isPlaying ? 'primary' : 'default'}></Button>
  );
};

export default WordPlayer;
