import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
  InputNumber,
  Switch,
  Divider,
  Select,
} from 'antd';
import signUpRules from '../../../signUp/validator';
import createCn from '../../../../utils/create-cn';
import type { RequestUserDataUpdate, User } from '../../../../types/user';
import type { Nullable } from '../../../../types/common';
import './style.css';
import {
  TRAINING_COUNTDOWN_RULES,
  TRAINING_ERROR_RULES,
  TRAINING_INTERVAL_RULES,
  TRAINING_MISTYPE_RULES,
  TRAINING_WORDS_PER_SESSION_RULES,
} from './validator';

const { Option } = Select;

type ProfileFormProps = {
  error: Nullable<string>;
  user: Nullable<User>;
  onSubmit: (data: RequestUserDataUpdate) => void;
};
const cn = createCn('profile-form');

function ProfileForm({ user, error, onSubmit }: ProfileFormProps) {
  const [form] = Form.useForm();
  const initialValues = {
    ...user,
    language: 'english',
  };

  const [isFormTouched, setIsFormTouched] = useState(false);

  const handleFormChange = () => {
    setIsFormTouched(form.isFieldsTouched());
  };

  return (
    <div className={cn('box')}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
        onValuesChange={handleFormChange}
        className={`${cn('form')}`}>
        <div className={cn('form-items')}>
          <Divider className={cn('form-divider')}>Данные пользователя</Divider>
          <Form.Item
            className={cn('form-item')}
            label="Email"
            name="email"
            rules={signUpRules.email}>
            <Input
              className={cn('form-item-input')}
              size="large"
              placeholder="Введите еmail"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Имя"
            name="name"
            rules={signUpRules.name}>
            <Input
              className={cn('form-item-input')}
              size="large"
              placeholder="Введите имя"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Новый пароль"
            name="password"
            rules={signUpRules.password}>
            <Input.Password
              className={cn('form-item-input')}
              size="large"
              placeholder="Введите пароль"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Повторите пароль"
            name="passwordRepeat"
            rules={[
              ...signUpRules.password,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // The Ant Design Form component's validation expects a string as a rejection reason for custom validators.
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Пароли не совпадают');
                },
              }),
            ]}>
            <Input.Password
              className={cn('form-item-input')}
              size="large"
              placeholder="Повторите пароль"
            />
          </Form.Item>
          <Divider className={cn('form-divider')}>Настройки тренировок</Divider>
          <Form.Item
            className={cn('form-item')}
            label="Лимит слов за одну сессию"
            name={['trainingSettings', 'wordsPerSession']}
            rules={TRAINING_WORDS_PER_SESSION_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для слов на сессию"
            />
          </Form.Item>
          <Form.Item
            label="Изучаемый язык"
            name="language"
            className={cn('form-item')}>
            <Select
              placeholder="Select a language"
              className={cn('form-item-select')}
              size="large">
              <Option value="english">English</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Интервал 1 (в днях)"
            name={['trainingSettings', 'stageOneInterval']}
            rules={TRAINING_INTERVAL_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для интервала 1"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Интервал 2 (в днях)"
            name={['trainingSettings', 'stageTwoInterval']}
            rules={TRAINING_INTERVAL_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для интервала 2"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Интервал 3 (в днях)"
            name={['trainingSettings', 'stageThreeInterval']}
            rules={TRAINING_INTERVAL_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для интервала 3"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Интервал 4 (в днях)"
            name={['trainingSettings', 'stageFourInterval']}
            rules={TRAINING_INTERVAL_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для интервала 4"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Интервал 5 (в днях)"
            name={['trainingSettings', 'stageFiveInterval']}
            rules={TRAINING_INTERVAL_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для интервала 5"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Время обратного отсчета (в секундах)"
            name={['trainingSettings', 'countdownTimeInSec']}
            rules={TRAINING_COUNTDOWN_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для времени обратного отсчета"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Лимит ошибок на слово"
            name={['trainingSettings', 'wordErrorLimit']}
            rules={TRAINING_ERROR_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для лимита ошибок на слово"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Лимит опечаток на слово"
            name={['trainingSettings', 'wordMistypeLimit']}
            rules={TRAINING_MISTYPE_RULES}>
            <InputNumber
              className={cn('form-item-input-number')}
              size="large"
              placeholder="Введите значение для лимита опечаток на слово"
            />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Использовать обратный отсчет"
            name={['trainingSettings', 'useCountdown']}
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Показывать подсказку*"
            name={['trainingSettings', 'showCollectionNameHint']}
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Озвучивать слова"
            name={['trainingSettings', 'synthVoiceAutoStart']}
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            label="Распознавать речь"
            name={['trainingSettings', 'speechRecognizerAutoStart']}
            valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            className={cn('form-item')}
            hidden
            label="Строгий режим**"
            name={['trainingSettings', 'strictMode']}
            valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
        {error && (
          <Alert message={error} type="error" className={cn('form-alert')} />
        )}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className={cn('form-submit-button')}
          disabled={!isFormTouched}>
          Сохранить
        </Button>
      </Form>
    </div>
  );
}

export default ProfileForm;
