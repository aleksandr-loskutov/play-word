import React, { useState } from 'react';
import { Alert, Form, Input, Modal, Radio } from 'antd';

type Values = {
  name: string;
  description: string;
  isPublic: boolean;
};

type CollectionCreateFormProps = {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
};

function CollectionCreateForm({
  open,
  onCreate,
  onCancel,
}: CollectionCreateFormProps): React.ReactElement {
  const [isPublic, setIsPublic] = useState(false);

  const handleRadioChange = (e: any) => {
    setIsPublic(e.target.value);
  };
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Добавить коллекцию"
      okText="Добавить"
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields(['name'])
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.warn('Ошибка валидации:', info);
          });
      }}>
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ isPublic: true }}>
        <Form.Item
          name="name"
          label="Название коллекции"
          rules={[
            {
              required: true,
              message: 'Введите название коллекции',
            },
            { min: 4, message: 'Название должно быть не менее 4 символов' },
            { max: 40, message: 'Название должно быть не более 40 символов' },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Краткое описание">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="isPublic"
          className="collection-create-form_last-form-item">
          <>
            <Radio.Group onChange={handleRadioChange}>
              <Radio value={false}>Личная</Radio>
              <Radio value>Публичная</Radio>
            </Radio.Group>
            {isPublic && (
              <Alert
                message="Внимание"
                description="Публичная коллекция будет сразу доступна вам, но доступ для других пользователей будет предоставлен позже."
                type="warning"
                showIcon
                style={{ backgroundColor: 'transparent', border: 'none' }}
              />
            )}
          </>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CollectionCreateForm;
