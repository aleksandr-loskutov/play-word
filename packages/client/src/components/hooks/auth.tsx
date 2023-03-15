import React, { useEffect, useContext, createContext } from 'react'
import { NavigateFunction } from 'react-router'
import { useAppDispatch, useAppSelector } from './store'
import {
  fetchUser,
  signIn as login,
  signInOAuth,
  signOut as logout,
  signUp as register,
} from '../../store/action-creators/auth'
import { UserEntity } from '../../types/user'
import { Nullable } from '../../types/common'
import { getServiceIdFromProvider } from '../../pages/signIn/services/signin-service'
import { SignInDTO, SignUpDTO } from '../../types/auth'
import { getTraining } from '../../store/action-creators/training'

type Props = {
  children: React.ReactNode
}

type AuthContextProps = {
  user: Nullable<UserEntity>
  signUp: (credentials: SignUpDTO) => any
  signIn: (credentials: SignInDTO) => any
  signOut: () => any
  error: string | null
  isLoading: boolean
  isLoggedIn: boolean
  getProviderServiceId: (providerName: string) => any
  signInWithProvider: (code: string, navigate: NavigateFunction) => any
}

const authContext = createContext<AuthContextProps>({} as AuthContextProps)
export const useAuth = () => useContext(authContext)

function useAuthProvider() {
  const dispatch = useAppDispatch()

  const { user, error, isLoading, isLoggedIn } = useAppSelector(
    state => state.user
  )
  const { error: errorTraining, isLoading: isLoadingTraining } = useAppSelector(
    state => state.training
  )

  const signUp = (credentials: SignUpDTO): void => {
    dispatch(register(credentials))
  }

  const signIn = (credentials: SignInDTO): void => {
    dispatch(login(credentials))
  }

  const signOut = (): void => {
    dispatch(logout())
  }

  const getProviderServiceId = async (providerName: string) => {
    const response = await getServiceIdFromProvider(providerName)
    return response
  }
  const signInWithProvider = (
    code: string,
    navigate: NavigateFunction
  ): void => {
    dispatch(signInOAuth({ code, navigate }))
  }

  useEffect(() => {
    if (user && !isLoadingTraining) {
      dispatch(getTraining())
    }
  }, [user])

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(fetchUser())
    }
  }, [])

  return {
    user,
    signUp,
    signIn,
    signOut,
    error,
    isLoading,
    isLoggedIn,
    signInWithProvider,
    getProviderServiceId,
    errorTraining,
    isLoadingTraining,
  }
}

export function AuthProvider({ children }: Props) {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
