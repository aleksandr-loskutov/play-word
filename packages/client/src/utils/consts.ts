import { Indexable } from '../types/common'

const APP_URL = 'http://localhost:3001'
const API_PATH = '/api'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const PROD_URL = 'https://prod.online'
const DEV_URL = `http://localhost:${__CLIENT_PORT__}`
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

const PALETTE = {
  primary: '#45f3ff',
  secondary: '#1b8aab',
  background: '#121212',
  surface: '#1f1f1f',
  error: '#f44336',
  success: '#4caf50',
  warning: '#ffc107',
  info: '#2196f3',
  onPrimary: '#000000',
  onSecondary: '#ffffff',
  onBackground: '#b0b0b0',
  onSurface: '#b0b0b0',
  onError: '#ffffff',
  onSuccess: '#ffffff',
  onWarning: '#000000',
  onInfo: '#ffffff',
  transparent: 'transparent',
}

// theme customization
const THEME_CUSTOM_CSS_PROPS = {
  colorPrimary: PALETTE.secondary,
  colorPrimaryHover: PALETTE.primary,
  colorBgContainer: PALETTE.background,
  colorLink: PALETTE.secondary,
  colorLinkHover: PALETTE.primary,
  colorLinkActive: PALETTE.primary,
  colorItemBgSelected: PALETTE.background,
  colorItemTextSelected: PALETTE.primary,
  colorItemTextSelectedHorizontal: PALETTE.primary,
  colorItemTextHoverHorizontal: PALETTE.primary,
  colorItemText: PALETTE.onBackground,
  colorItemTextHover: PALETTE.primary,
  colorTextHeading: PALETTE.onBackground,
  colorText: PALETTE.onBackground,
  colorErrorBg: PALETTE.surface,
  colorBgHeader: PALETTE.transparent,
}

const NOTIFICATION_SHADOWS = {
  success: `0 0 10px ${PALETTE.primary}, 0 0 1px ${PALETTE.primary}`,
  error: `0 0 10px ${PALETTE.error}, 0 0 1px ${PALETTE.error}`,
  warning: `0 0 10px ${PALETTE.warning}, 0 0 1px ${PALETTE.warning}`,
  info: `0 0 10px ${PALETTE.info}, 0 0 1px ${PALETTE.info}`,
}

const THEME_COMPONENTS_WITH_CUSTOM_CSS_PROPS: string[] = [
  'Button',
  'Input',
  'InputNumber',
  'Select',
  'Switch',
  'Radio',
  'Upload',
  'Menu',
  'Layout',
  'Typography',
  'Card',
  'Form',
  'Alert',
]

export default {
  APP_URL,
  API_PATH,
  OAUTH_PROVIDERS,
  IS_PRODUCTION,
  PROD_URL,
  DEV_URL,
  AVATAR_PLACEHOLDER,
  THEME_CUSTOM_CSS_PROPS,
  THEME_COMPONENTS_WITH_CUSTOM_CSS_PROPS,
  PALETTE,
  NOTIFICATION_SHADOWS,
}
