import { Button, Typography } from 'antd';
import { useAuth } from '../../../components/hooks/auth';

const { Paragraph } = Typography;

type TrainingStartProps = {
  handleStartTraining: () => void;
};

function TrainingStart({
  handleStartTraining,
}: TrainingStartProps): React.ReactElement | null {
  const { user, training } = useAuth();
  return (
    user && (
      <div>
        <Paragraph>
          {training.length > 0
            ? `У вас есть ${
                training.length
              } слов для повторения, давайте начнем! \r\n Вы тренируете до ${
                user.trainingSettings.wordsPerSession
              }  слов за подход ${
                user.trainingSettings.useCountdown
                  ? 'с таймером'
                  : 'без таймера'
              }`
            : 'У вас нет слов для повторения. Добавьте новые из коллекций или подождите пока текущие не "созреют".'}
        </Paragraph>

        {training.length > 0 && (
          <Button type="primary" onClick={handleStartTraining} autoFocus>
            Начать
          </Button>
        )}
      </div>
    )
  );
}

export default TrainingStart;
