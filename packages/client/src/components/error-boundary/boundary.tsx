import { Component, ReactNode, ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
  navigate: (path: string) => void;
};

class ErrorBoundary extends Component<Props> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { navigate } = this.props;
    navigate('/error');
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export default ErrorBoundary;
