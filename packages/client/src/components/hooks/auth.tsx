import React, { useEffect, useContext, createContext } from 'react';
import { NavigateFunction } from 'react-router';
import { useAppDispatch, useAppSelector } from './store';
import {
  fetchUser,
  signIn as login,
  signOut as logout,
  signUp as register,
} from '../../store/action-creators/auth';
import { User } from '../../types/user';
import { Nullable } from '../../types/common';
import { SignInDTO, SignUpDTO } from '../../types/auth';
import { getTraining } from '../../store/action-creators/training';
import { UserWordProgress } from '../../types/training';
import { Response } from '../../types/api';
import { setUserInitialized } from '../../store/reducers/user';

type Props = {
  children: React.ReactNode;
};

type AuthContextProps = {
  user: Nullable<User>;
  signUp: (credentials: SignUpDTO) => any;
  signIn: (credentials: SignInDTO) => any;
  signOut: () => any;
  error: string | null;
  isLoading: boolean | null;
  isLoggedIn: boolean;
  isLoadingTraining: boolean;
  training: UserWordProgress[];
};

const authContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(authContext);

function useAuthProvider() {
  const dispatch = useAppDispatch();

  const { user, error, isLoading, isLoggedIn } = useAppSelector(
    (state) => state.user,
  );
  const {
    error: errorTraining,
    isLoading: isLoadingTraining,
    training,
  } = useAppSelector((state) => state.training);

  const signUp = (credentials: SignUpDTO) => {
    return dispatch(register(credentials));
  };

  const signIn = (credentials: SignInDTO) => {
    return dispatch(login(credentials));
  };

  const signOut = () => {
    return dispatch(logout());
  };

  useEffect(() => {
    if (user && !isLoadingTraining) {
      dispatch(getTraining());
    }
  }, [user]);

  useEffect(() => {
    if (!user && isLoading === null) {
      dispatch(fetchUser()).finally(() => {
        dispatch(setUserInitialized());
      });
    } else {
      dispatch(setUserInitialized());
    }
  }, []);

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
  };
}

export function AuthProvider({ children }: Props) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
