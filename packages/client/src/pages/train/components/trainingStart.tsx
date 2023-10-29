import { Button, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../../components/hooks/auth';

const { Title } = Typography;

type TrainingStartProps = {
  handleStartTraining: () => void;
};

function TrainingStart({
  handleStartTraining,
}: TrainingStartProps): React.ReactElement | null {
  const { user, training } = useAuth();
  const wordsForTrainingCount = training.length;
  const navigate = useNavigate();
  return (
    user && (
      <div>
        {training.length > 0 ? (
          <>
            <Title level={3}>
              <span className="title-highlight">
                {wordsForTrainingCount} слов(а)
              </span>
              готовы к тренировке
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleStartTraining}
              autoFocus>
              НАЧАТЬ
            </Button>
          </>
        ) : (
          <>
            <Title level={4}>Нет слов для повторения</Title>
            <Title level={5} style={{ textTransform: 'none' }}>
              Добавьте больше слов в тренировку из{' '}
              <Link to="/collections">коллекций</Link> или подождите пока
              текущие не `созреют`
            </Title>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/collections')}
              autoFocus>
              добавить слова
            </Button>
          </>
        )}
      </div>
    )
  );
}

export default TrainingStart;
