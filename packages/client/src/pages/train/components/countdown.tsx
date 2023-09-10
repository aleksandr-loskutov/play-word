import React, { useRef, useEffect, useState } from 'react';

interface CountdownProps {
  seconds: number;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setRemainingSeconds(seconds);
  }, [seconds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentContainer = canvas.parentNode as HTMLElement;
    const rect = parentContainer.getBoundingClientRect();

    setDimensions({
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || remainingSeconds <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, '#1b8aab');
    gradient.addColorStop(1, '#45f3ff');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 5;

    const draw = () => {
      const progress = 1 - remainingSeconds / seconds;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.1;

      const currentWidth = canvas.width * progress;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, currentWidth, canvas.height);
    };

    draw();
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0.1) {
          clearInterval(timer);
          return 0;
        } else {
          draw();
          return newTime;
        }
      });
    }, 100);

    return () => {
      clearInterval(timer);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0) {
      onComplete();
    }
  }, [remainingSeconds]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        pointerEvents: 'none',
      }}
    />
  );
};

export default Countdown;
