export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  email: string;
  name: string;
  password: string;
};

export type OAuthSignInYandexDTO = {
  code: string;
  redirect_uri: string;
};

export type OAuthServiceIdDTO = {
  service_id: string;
};

export type OAuthProvider = {
  name: string;
  serviceUrl: string;
  redirectURI?: string;
  signInURI?: string;
  getServiceIdURI?: string;
};
