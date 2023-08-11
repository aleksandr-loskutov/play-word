import React from 'react'
import { Progress } from 'antd'
import Title from 'antd/lib/typography/Title'
import { WordStats } from '../../../types/training'
import TrainingStatsTable from './trainingStatsTable'
import { useAuth } from '../../../components/hooks/auth'
import createCn from '../../../utils/create-cn'

type TrainingStatsProps = {
  trainingStats: WordStats[]
}
const cn = createCn('train-page')

const TrainingStats: React.FC<TrainingStatsProps> = ({ trainingStats }) => {
  const { training } = useAuth()
  return (
    <>
      {trainingStats.length > 0 && (
        <>
          <Title level={2} style={{ color: 'white' }}>
            Результаты тренировки
          </Title>
          <TrainingStatsTable trainingStats={trainingStats} />
          <Progress
            status="active"
            percent={Math.round(
              (trainingStats.length /
                (trainingStats.length + training.length)) *
                100
            )}
            strokeColor={{ from: '#108ee9', to: '#87d068' }}
          />
        </>
      )}
    </>
  )
}

export default TrainingStats
