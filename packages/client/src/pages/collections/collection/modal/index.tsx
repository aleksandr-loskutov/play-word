import { useState } from 'react'
import { Modal, Table, Button, Form, Input, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import Papa from 'papaparse'
import { WordForCollection } from '../../../../types/collection'

const { Dragger } = Upload

type AddWordsModalProps = {
  visible: boolean
  onClose: () => void
  onSubmit: (words: WordForCollection[]) => void
  initialWords: WordForCollection[]
}

const AddWordsModal = ({
  visible,
  onClose,
  onSubmit,
  initialWords,
}: AddWordsModalProps) => {
  const [form] = Form.useForm()
  const [words, setWords] = useState<WordForCollection[]>(initialWords)
  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit(words.concat([values]))
      // setWords([])
      // form.resetFields()
      onClose()
    })
  }

  const handleCancel = () => {
    // setWords([])
    // form.resetFields()
    onClose()
  }

  const handleWordChange = (value: string, index: number) => {
    const newWords = [...words]
    newWords[index].word = value
    setWords(newWords)
  }

  const handleTranslationChange = (value: string, index: number) => {
    const newWords = [...words]
    newWords[index].translation = value
    setWords(newWords)
  }

  const handleAddWordRow = () => {
    setWords([...words, { word: '', translation: '' }])
  }

  const handleUpload = (file: File) => {
    if (!file) {
      // File is not valid
      return
    }

    Papa.parse(file, {
      complete: function (results) {
        // Process CSV data
        const importedWords = results.data
          .filter(row => row.length === 2)
          .map(row => ({ word: row[0], translation: row[1] }))
        setWords(words.concat(importedWords))
        message.success(`${importedWords.length} words imported successfully`)
      },
      error: function () {
        message.error('Error parsing CSV file')
      },
    })
  }

  return (
    <Modal open={visible} onCancel={handleCancel} onOk={handleOk}>
      <Form form={form}>
        <Table
          dataSource={words.map((row, index) => ({ ...row, key: index }))}
          columns={[
            {
              title: 'Word',
              dataIndex: 'word',
              key: 'word',
              render: (text, record, index) => (
                <Input
                  value={text}
                  onChange={e => handleWordChange(e.target.value, index)}
                />
              ),
            },
            {
              title: 'Translation',
              dataIndex: 'translation',
              key: 'translation',
              render: (text, record, index) => (
                <Input
                  value={text}
                  onChange={e => handleTranslationChange(e.target.value, index)}
                />
              ),
            },
          ]}
          pagination={false}
        />
        <Button onClick={handleAddWordRow}>Add row</Button>
        <Dragger
          accept=".csv"
          showUploadList={false}
          beforeUpload={file => {
            // Clear current words before importing new ones
            setWords([])
            return true
          }}
          customRequest={options => {
            handleUpload(options.file)
          }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to</p>
        </Dragger>
      </Form>
    </Modal>
  )
}

export default AddWordsModal
