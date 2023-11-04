import { Route, Routes } from 'react-router-dom';
import SignInPage from '../pages/signIn';
import SignUpPage from '../pages/signUp';
import ProfilePage from '../pages/profile';
import TrainPage from '../pages/train';
import ErrorBoundary from '../components/error-boundary';
import ErrorPage from '../pages/error';
import NotFoundPage from '../pages/notFound';
import CollectionsLayout from '../pages/collections/layout';
import MainPage from '../pages/main';

function AppRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/train" element={<TrainPage />} />
        <Route path="/collections/:id?" element={<CollectionsLayout />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRouter;
