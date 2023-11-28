import React, { useRef, useEffect, useState } from 'react';
import useScreenSize from '../../../components/hooks/screenSize';

type CountdownProps = {
  seconds: number;
  onComplete: () => void;
};

function Countdown({
  seconds,
  onComplete,
}: CountdownProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);
  const { screenWidth } = useScreenSize();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentContainer = canvas.parentNode as HTMLElement;
    const rect = parentContainer.getBoundingClientRect();
    setDimensions({
      width: rect.width,
      height: rect.height,
    });
  }, [screenWidth]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
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
        }
        draw();
        return newTime;
      });
    }, 100);

    // eslint-disable-next-line consistent-return
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
}

export default Countdown;
