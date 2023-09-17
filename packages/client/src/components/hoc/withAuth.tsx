import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth';
import PageLoader from '../page-loader';

const withAuth = (Component: React.FC) =>
  function AuthenticatedComponent(props: any) {
    const auth = useAuth();
    const navigate = useNavigate();
    const { isLoggedIn, isLoading } = auth;
    const needAuth = !isLoading && !isLoggedIn;

    useEffect(() => {
      if (needAuth) {
        navigate('/sign-in');
      }
    }, [isLoggedIn, isLoading]);
    // using prop spreading is ok for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return isLoading ? <PageLoader /> : <Component {...props} />;
  };

export default withAuth;
