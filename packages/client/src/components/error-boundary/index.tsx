import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Boundary from './boundary';

type Props = {
  children: ReactNode;
};

function ErrorBoundary({ children }: Props) {
  const navigate = useNavigate();

  return <Boundary navigate={navigate}>{children}</Boundary>;
}

export default ErrorBoundary;
