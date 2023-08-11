import React from 'react'
import { Table, Typography } from 'antd'
import { WordStats } from '../../../types/training'

const { Paragraph } = Typography

const TrainingStatsTable = ({
  trainingStats,
}: {
  trainingStats: WordStats[]
}) => {
  const columns = [
    {
      title: 'Слово',
      dataIndex: 'translation',
      key: 'translation',
    },
    {
      title: 'Перевод',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: 'Ступень',
      dataIndex: 'stage',
      key: 'stage',
    },
    {
      title: 'Коллекция',
      dataIndex: 'collectionName',
      key: 'collectionName',
    },
    {
      title: 'Время затр.',
      dataIndex: 'timeSpent',
      key: 'timeSpent',
      render: (timeSpent: number) => `${timeSpent} мин.`,
    },
    {
      title: 'Ошибок',
      dataIndex: 'errorCounter',
      key: 'errorCounter',
    },
    {
      title: 'След. подход',
      dataIndex: 'nextReview',
      key: 'nextReview',
      render: (nextReview: Date) => {
        const today = new Date()
        const timeDifferenceInMilliseconds =
          nextReview.getTime() - today.getTime()
        const timeDifferenceInDays = parseFloat(
          (timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)).toFixed(1)
        )
        return `через ${timeDifferenceInDays} дней`
      },
    },
  ]

  console.log('trainingStats', trainingStats)

  return (
    <>
      {trainingStats.length > 0 && (
        <Table
          dataSource={trainingStats}
          columns={columns}
          pagination={false}
          rowKey={record => record.word}
        />
      )}
    </>
  )
}

export default TrainingStatsTable
