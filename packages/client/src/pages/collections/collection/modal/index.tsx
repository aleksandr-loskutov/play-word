import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  Upload,
  Col,
  Row,
  InputRef,
} from 'antd';
import { DeleteOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
import type { WordForCollection } from '../../../../types/collection';
import customNotification from '../../../../components/custom-notification/customNotification';
import validateArrayForEmptyStringAndLength from '../../../../utils/validate-array';

const { Dragger } = Upload;

type AddWordsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (words: WordForCollection[]) => void;
  initialWords: WordForCollection[];
};

function AddWordsModal({
  visible,
  onClose,
  onSubmit,
  initialWords,
}: AddWordsModalProps): React.ReactElement {
  const [form] = Form.useForm();
  const [words, setWords] = useState<WordForCollection[]>(
    initialWords.length > 0 ? initialWords : [{ word: '', translation: '' }]
  );
  const wordsRef = useRef<InputRef[]>([]);
  const handleAddWordRow = () => {
    setWords([...words, { word: '', translation: '' }]);
  };
  const anyRowIsEmpty = words.some(
    (row) => row.word === '' || row.translation === ''
  );
  useEffect(() => {
    wordsRef.current.length = words.length;
    const lastInputRef = wordsRef.current[words.length - 1];
    if (lastInputRef) {
      lastInputRef.focus();
    }
  }, [words.length]);

  useEffect(() => {
    const handleEnterKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !anyRowIsEmpty) {
        handleAddWordRow();
      }
    };
    document.addEventListener('keydown', handleEnterKeyDown);
    return () => {
      document.removeEventListener('keydown', handleEnterKeyDown);
    };
  }, [anyRowIsEmpty, handleAddWordRow]);

  const handleOk = () => {
    // Filter out empty rows
    const validWords = words
      .filter((row) => row.word !== '' && row.translation !== '')
      .map((row) => ({
        ...row,
        word: row.word.trim(),
        translation: row.translation.trim(),
      }));
    // we are temporarily is not using antd form validation
    const isValid = validateArrayForEmptyStringAndLength(validWords, [
      'word',
      'translation',
    ]);
    if (!isValid) return;
    // TODO use antd form validation
    form
      .validateFields()
      .then((values: any) => {
        // Submit only valid rows
        onSubmit(validWords.concat([values]));
        onClose();
      })
      .catch((e: any) => {
        customNotification({
          message: 'Ошибка!',
          description: `Ошибка валидации формы: ${e.message}`,
          type: 'error',
        });
      });
  };

  const handleCancel = () => {
    onClose();
  };

  const handleWordChange = (value: string, index: number) => {
    const newWords = words.map((word, i) =>
      i === index ? { ...word, word: value } : word
    );
    setWords(newWords);
  };

  const handleTranslationChange = (value: string, index: number) => {
    const newWords = words.map((word, i) =>
      i === index ? { ...word, translation: value } : word
    );
    setWords(newWords);
  };

  const handleUpload = (file: File) => {
    if (!file) {
      // File is not valid
      return;
    }

    Papa.parse(file, {
      complete(results) {
        // Process CSV data
        const importedWords = results.data
          .filter((row: any) => row.length === 2)
          .map((row: any) => ({ word: row[0], translation: row[1] }))
          .filter((row) => row.word !== '' && row.translation !== ''); // Filter out invalid rows
        setWords(words.concat(importedWords));
        customNotification({
          message: 'Успешно!',
          description: `${importedWords.length} слова успешно добавлены`,
          type: 'success',
        });
      },
      error() {
        customNotification({
          message: 'Ошибка!',
          description: `Проблема при чтении файла`,
          type: 'error',
        });
      },
    });
  };
  const handleDeleteWordRow = (index: number) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      cancelText="Отмена"
      okText="Сохранить">
      <Form form={form}>
        <Row gutter={[10, 10]} justify="center" align="middle">
          <Col span={24}>
            <Table
              dataSource={words.map((row, index) => ({ ...row, key: index }))}
              columns={[
                {
                  title: 'Слово',
                  dataIndex: 'word',
                  key: 'word',
                  render: (text, _record, index) => (
                    <Input
                      value={text}
                      placeholder={index === 0 ? 'Apple' : ''}
                      onChange={(e) => handleWordChange(e.target.value, index)}
                      ref={(el) => {
                        if (el) {
                          wordsRef.current[index] = el;
                        }
                      }}
                    />
                  ),
                },
                {
                  title: 'Перевод',
                  dataIndex: 'translation',
                  key: 'translation',
                  render: (text, _record, index) => (
                    <Input
                      value={text}
                      placeholder={index === 0 ? 'Яблоко' : ''}
                      onChange={(e) =>
                        handleTranslationChange(e.target.value, index)
                      }
                    />
                  ),
                },
                {
                  title: 'Удалить',
                  key: 'action',
                  render: (_text, _record, index) => (
                    <div className="text-center">
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
              type="default"
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
              beforeUpload={() => {
                // Clear current words before importing new ones
                setWords([]);
                return true; // default upload behavior
              }}
              customRequest={(options) => {
                if (options.file instanceof File) {
                  handleUpload(options.file);
                }
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
  );
}

export default AddWordsModal;
