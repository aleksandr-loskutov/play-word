import React, { useEffect, useContext, createContext } from 'react';
import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from './store';
import {
  fetchUser,
  signIn as login,
  signOut as logout,
  signUp as register,
} from '../../store/action-creators/auth';
import type { User } from '../../types/user';
import type { Nullable } from '../../types/common';
import type { SignInDTO, SignUpDTO } from '../../types/auth';
import { getTraining } from '../../store/action-creators/training';
import type { UserWordProgress } from '../../types/training';
import { setUserInitialized, setInTraining } from '../../store/reducers/user';

type Props = {
  children: React.ReactNode;
};

type AuthContextProps = {
  user: Nullable<User>;
  signUp: (credentials: SignUpDTO) => any;
  signIn: (credentials: SignInDTO) => any;
  signOut: () => void;
  error: string | null;
  isLoading: boolean | null;
  isLoggedIn: boolean;
  isLoadingTraining: boolean | null;
  training: UserWordProgress[];
  isInTraining: boolean;
  setIsInTraining: (isTraining: boolean) => void;
  errorTraining: string | null;
};

const authContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(authContext);

function useAuthProvider() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { user, error, isLoading, isLoggedIn, isInTraining } = useAppSelector(
    (state) => state.user
  );
  const {
    error: errorTraining,
    isLoading: isLoadingTraining,
    training,
  } = useAppSelector((state) => state.training);

  const signUp = (credentials: SignUpDTO) => dispatch(register(credentials));

  const signIn = (credentials: SignInDTO) => dispatch(login(credentials));

  const signOut = () => dispatch(logout());

  useEffect(() => {
    if (user && !isLoadingTraining) {
      dispatch(getTraining());
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !isLoadingTraining && !isInTraining) {
        dispatch(getTraining());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, isLoadingTraining, isInTraining, dispatch]);

  useEffect(() => {
    if (isInTraining) {
      dispatch(setInTraining(false));
    }
  }, [location]);

  useEffect(() => {
    if (!user && isLoading === null) {
      dispatch(fetchUser()).finally(() => {
        dispatch(setUserInitialized());
      });
    } else {
      dispatch(setUserInitialized());
    }
  }, []);

  const setIsInTraining = (isTraining: boolean) =>
    dispatch(setInTraining(isTraining));

  return {
    user,
    signUp,
    signIn,
    signOut,
    error,
    isLoading,
    isLoggedIn,
    training,
    errorTraining,
    isLoadingTraining,
    isInTraining,
    setIsInTraining,
  };
}

export function AuthProvider({ children }: Props) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
