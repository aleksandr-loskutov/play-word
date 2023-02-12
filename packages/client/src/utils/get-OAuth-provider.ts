import { OAUTH_PROVIDERS } from './consts';

export const getOAuthProviders = () =>
  Object.entries(OAUTH_PROVIDERS).map(entry => entry[1]);

const getOAuthProvider = (provider: string) =>
  getOAuthProviders().filter(item => item.name === provider)[0];
export default getOAuthProvider;
