import React from 'react'
import { Tooltip } from 'antd'
import createCn from '../../../utils/create-cn'

type WordWithTooltipProps = {
  collectionName: string | undefined
  word: string
  showCollectionNameHint: boolean
}
const cn = createCn('train-page')

const WordWithTooltip: React.FC<WordWithTooltipProps> = ({
  collectionName,
  word,
  showCollectionNameHint,
}) => {
  const showCollectionNameHintProp = showCollectionNameHint
    ? { open: true }
    : {}

  return (
    <Tooltip
      title={collectionName}
      color="cyan"
      {...showCollectionNameHintProp}>
      <span className={cn('word')}>{word.toUpperCase()}</span>
    </Tooltip>
  )
}

export default WordWithTooltip
