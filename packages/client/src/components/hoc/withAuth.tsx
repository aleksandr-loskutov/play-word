import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth';
import PageLoader from '../page-loader';

const withAuth = (Component: React.FC) => {
  return function AuthenticatedComponent(props: any) {
    const auth = useAuth();
    const navigate = useNavigate();
    const { isLoggedIn, isLoading } = auth;
    const needAuth = !isLoading && !isLoggedIn;

    useEffect(() => {
      if (needAuth) {
        navigate('/sign-in');
      }
    }, [isLoggedIn, isLoading]);

    return isLoading ? <PageLoader /> : <Component {...props} />;
  };
};

export default withAuth;
