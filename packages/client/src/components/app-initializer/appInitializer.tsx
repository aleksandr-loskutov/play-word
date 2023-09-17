import React from 'react';
import { useAppSelector } from '../hooks/store';
import { RootState } from '../../store';
import PageLoader from '../page-loader';
import AppRouter from '../../router/router';
import Layout from '../layout';

function AppInitializer(): React.ReactElement {
  const isInitialized = useAppSelector(
    (state: RootState) => state.user.isInitialized
  );

  return <Layout>{isInitialized ? <AppRouter /> : <PageLoader />}</Layout>;
}

export default AppInitializer;
