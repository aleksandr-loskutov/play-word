import React from 'react'
import { Tooltip } from 'antd'
import createCn from '../../../utils/create-cn'

type WordWithTooltipProps = {
  collectionName: string | undefined
  word: string
  showCollectionNameHint: boolean
  isWordNew: boolean
}
const cn = createCn('train-page')

const WordWithTooltip: React.FC<WordWithTooltipProps> = ({
  collectionName,
  word,
  showCollectionNameHint,
  isWordNew,
}) => {
  const showCollectionNameHintProp = showCollectionNameHint
    ? { open: true }
    : {}

  return (
    <div className={cn('badge-container')}>
      <Tooltip
        title={collectionName}
        color="cyan"
        {...showCollectionNameHintProp}>
        <span className={cn('word')}>{word.toUpperCase()}</span>
      </Tooltip>
      {isWordNew && (
        <Tooltip
          title={'для новых слов кол-во ошибок игнорируется'}
          color="cyan">
          <div className={cn('badge')}>new</div>{' '}
        </Tooltip>
      )}
    </div>
  )
}

export default WordWithTooltip
