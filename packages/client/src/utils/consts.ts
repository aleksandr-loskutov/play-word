import { Indexable } from '../types/common'

const APP_URL = 'http://localhost:3001'
const API_PATH = '/api'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const PROD_URL = 'https://prod.online'
const DEV_URL = `http://localhost:${__CLIENT_PORT__}`
const FORUM_API_URL = IS_PRODUCTION
  ? `https://api.prod.online/api`
  : `http://localhost:${__SERVER_PORT__}/api`
const AVATAR_PLACEHOLDER =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
// OAuth providers
export const OAUTH_PROVIDERS: Indexable<any> = {
  yandex: {
    name: 'Yandex',
    serviceUrl:
      'https://oauth.yandex.ru/authorize?response_type=code&client_id=',
    signInURI: '',
    getServiceIdURI: '',
    redirectURI: IS_PRODUCTION ? PROD_URL : DEV_URL,
  },
}
//  Local storage keys
export enum Locals {
  OAUTH_PROVIDER = 'oauth-provider',
}

export default {
  APP_URL,
  API_PATH,
  OAUTH_PROVIDERS,
  IS_PRODUCTION,
  PROD_URL,
  DEV_URL,
  AVATAR_PLACEHOLDER,
}
