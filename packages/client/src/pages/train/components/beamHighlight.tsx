import { useRef, useEffect, useState } from 'react';
import CONSTS from '../../../utils/consts';

type BeamHighlightProps = {
  animate: boolean;
  speed?: number;
};

function BeamHighlight({ animate, speed = 3000 }: BeamHighlightProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentContainer = canvas.parentNode as HTMLElement;
    const inputElement = parentContainer.children[0] as HTMLElement;
    const rect = inputElement.getBoundingClientRect();

    setDimensions({
      width: rect.width,
      height: rect.height,
    });
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animate) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const beamColor = CONSTS.PALETTE.primary;
    const duration = speed; // Duration of the animation in milliseconds

    const drawBeams = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Top Beam
      if (progress < 1) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width * progress, 0);
        ctx.strokeStyle = beamColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Bottom Beam
      if (progress < 1) {
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width - canvas.width * progress, canvas.height);
        ctx.strokeStyle = beamColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(drawBeams);
      } else {
        startTime = null;
      }
    };

    animationFrameId = requestAnimationFrame(drawBeams);

    // eslint-disable-next-line consistent-return
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [dimensions, animate, speed]);

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

BeamHighlight.defaultProps = {
  speed: 1000,
};

export default BeamHighlight;
