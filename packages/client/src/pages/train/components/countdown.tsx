import React, { useEffect, useState } from 'react'

type CountdownProps = {
  seconds: number
  maxBlocks: number
  onComplete: () => void
}

const Countdown = ({ seconds, maxBlocks, onComplete }: CountdownProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds)

  useEffect(() => {
    setRemainingSeconds(seconds) // Reset remainingSeconds when seconds prop changes
  }, [seconds])

  useEffect(() => {
    if (remainingSeconds > 0) {
      const timer = setInterval(() => {
        setRemainingSeconds(prevSeconds => prevSeconds - 1)
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    } else {
      onComplete()
    }
  }, [remainingSeconds])

  const renderBlocks = () => {
    const blocks = []
    const ratio = remainingSeconds / seconds
    const numBlocks = Math.min(Math.round(maxBlocks * ratio), maxBlocks)

    for (let i = maxBlocks - 1; i >= 0; i--) {
      const isActive = i < maxBlocks - numBlocks
      const blockColor = isActive ? 'active-color' : 'inactive-color'

      blocks.unshift(<div key={i} className={`block ${blockColor}`} />)
    }

    return blocks
  }

  return <div className="countdown">{renderBlocks()}</div>
}

export default Countdown
