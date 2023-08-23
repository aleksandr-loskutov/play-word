import { useEffect, useRef, useState } from 'react'
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  Upload,
  message,
  Space,
  Col,
  Row,
} from 'antd'
import { DeleteOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons'
import Papa from 'papaparse'
import { WordForCollection } from '../../../../types/collection'
import { customNotification } from '../../../../components/custom-notification/customNotification'
import Title from 'antd/lib/typography/Title'

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
  const [words, setWords] = useState<WordForCollection[]>(
    initialWords.length > 0 ? initialWords : [{ word: '', translation: '' }]
  )
  const wordsRef = useRef([])
  const handleAddWordRow = () => {
    setWords([...words, { word: '', translation: '' }])
  }
  const anyRowIsEmpty = words.some(
    row => row.word === '' || row.translation === ''
  )
  useEffect(() => {
    wordsRef.current.length = words.length
    const lastInputRef = wordsRef.current[words.length - 1]
    if (lastInputRef) {
      lastInputRef.focus()
    }
  }, [words.length])

  useEffect(() => {
    const handleEnterKeyDown = event => {
      if (event.key === 'Enter' && !anyRowIsEmpty) {
        handleAddWordRow()
      }
    }
    document.addEventListener('keydown', handleEnterKeyDown)
    return () => {
      document.removeEventListener('keydown', handleEnterKeyDown)
    }
  }, [anyRowIsEmpty, handleAddWordRow])

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        onSubmit(words.concat([values]))
        onClose()
      })
      .catch(_ => {
        customNotification({
          message: 'Ошибка!',
          description: 'Ошибка валидации',
          type: 'error',
        })
      })
  }

  const handleCancel = () => {
    onClose()
  }

  const handleWordChange = (value: string, index: number) => {
    const newWords = words.map((word, i) =>
      i === index ? { ...word, word: value } : word
    )
    setWords(newWords)
  }

  const handleTranslationChange = (value: string, index: number) => {
    const newWords = words.map((word, i) =>
      i === index ? { ...word, translation: value } : word
    )
    setWords(newWords)
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
          .filter((row: any) => row.length === 2)
          .map((row: any) => ({ word: row[0], translation: row[1] }))
        setWords(words.concat(importedWords))
        message.success(`${importedWords.length} слова успешно добавлены`)
      },
      error: function () {
        message.error('Ошибка чтения файла')
      },
    })
  }
  const handleDeleteWordRow = (index: number) => {
    const newWords = [...words]
    newWords.splice(index, 1)
    setWords(newWords)
  }

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      cancelText={'Отмена'}
      okText={'Добавить в коллекцию'}>
      <Form form={form}>
        <Row gutter={[10, 10]} justify={'center'} align={'middle'}>
          <Col span={24}>
            <Table
              dataSource={words.map((row, index) => ({ ...row, key: index }))}
              columns={[
                {
                  title: 'Слово',
                  dataIndex: 'word',
                  key: 'word',
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      placeholder={index === 0 ? 'Apple' : ''}
                      onChange={e => handleWordChange(e.target.value, index)}
                      ref={el => (wordsRef.current[index] = el)}
                    />
                  ),
                },
                {
                  title: 'Перевод',
                  dataIndex: 'translation',
                  key: 'translation',
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      placeholder={index === 0 ? 'Яблоко' : ''}
                      onChange={e =>
                        handleTranslationChange(e.target.value, index)
                      }
                    />
                  ),
                },
                {
                  title: 'Удалить',
                  key: 'action',
                  render: (_text, _record, index) => (
                    <div className={'text-center'}>
                      <DeleteOutlined
                        onClick={() => handleDeleteWordRow(index)}
                      />
                    </div>
                  ),
                },
              ]}
              pagination={false}
            />
          </Col>
          <Col span={8}>
            <Button
              type={'default'}
              onClick={handleAddWordRow}
              icon={<PlusOutlined />}
              disabled={anyRowIsEmpty}>
              Добавить слово
            </Button>
          </Col>
          <Col span={20}>
            <Dragger
              accept=".csv"
              showUploadList={false}
              beforeUpload={file => {
                // Clear current words before importing new ones
                setWords([])
                return true // default upload behavior
              }}
              customRequest={options => {
                handleUpload(options.file)
              }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">или загрузить из csv файла</p>
            </Dragger>
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            <span> Слов: {words.length} из 100</span>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddWordsModal
