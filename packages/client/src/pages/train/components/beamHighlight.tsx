import React, { useRef, useEffect, useState } from 'react'

interface BeamHighlightProps {
  animate: boolean
  speed?: number
}

const BeamHighlight: React.FC<BeamHighlightProps> = ({
  animate,
  speed = 1000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parentContainer = canvas.parentNode as HTMLElement
    const inputElement = parentContainer.children[0] as HTMLElement
    const rect = inputElement.getBoundingClientRect()

    setDimensions({
      width: rect.width,
      height: rect.height,
    })
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !animate) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let start: number | null = null

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, 'rgba(69,243,255,0)')
    gradient.addColorStop(0.25, 'rgba(69,243,255,0.51)')
    gradient.addColorStop(0.5, '#45f3ff')
    gradient.addColorStop(0.75, '#33bccd')
    gradient.addColorStop(1, '#1b8aab')

    const draw = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = (timestamp - start) / speed

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 5

      if (progress <= 0.25) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width * progress * 4, 0)
        ctx.stroke()
      } else if (progress <= 0.5) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width, 0)
        ctx.lineTo(canvas.width, canvas.height * (progress - 0.25) * 4)
        ctx.stroke()
      } else if (progress <= 0.75) {
        ctx.beginPath()
        ctx.moveTo(canvas.width, 0)
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(
          canvas.width - canvas.width * (progress - 0.5) * 4,
          canvas.height
        )
        ctx.stroke()
      } else if (progress < 1) {
        ctx.beginPath()
        ctx.moveTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.lineTo(0, canvas.height - canvas.height * (progress - 0.75) * 4)
        ctx.stroke()
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(draw)
      } else {
        start = null
      }
    }

    let animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [dimensions])

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
  )
}

export default BeamHighlight
