import React from 'react';
import { Tooltip } from 'antd';
import createCn from '../../../utils/create-cn';

type WordWithTooltipProps = {
  collectionName: string | undefined;
  word: string;
  showCollectionNameHint: boolean;
  isWordNew: boolean;
};
const cn = createCn('train-page');

function WordWithTooltip({
  collectionName,
  word,
  showCollectionNameHint,
  isWordNew,
}: WordWithTooltipProps): React.ReactElement {
  return (
    <div className={cn('badge-container')}>
      <Tooltip
        title={collectionName}
        color="cyan"
        open={showCollectionNameHint ? true : undefined}>
        <span className={cn('word')}>{word.toUpperCase()}</span>
      </Tooltip>
      {isWordNew && (
        <Tooltip title="для новых слов кол-во ошибок игнорируется" color="cyan">
          <div className={cn('badge')}>new</div>{' '}
        </Tooltip>
      )}
    </div>
  );
}

export default WordWithTooltip;
