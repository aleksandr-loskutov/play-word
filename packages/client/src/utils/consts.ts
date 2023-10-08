const HOST_ENV = __HOST__; // from vite.config.ts
const IS_DEV = HOST_ENV === 'localhost' ? true : __IS_DEV__; // for testing production containers on localhost
const IS_PROD = !IS_DEV;
const CLIENT_PORT = __CLIENT_PORT__;
const SERVER_PORT = __SERVER_PORT__;
// build app url
const HOST = IS_PROD ? HOST_ENV : 'localhost';
const IS_HTTPS = IS_PROD;
const PROTOCOL = IS_HTTPS ? 'https' : 'http';
const URL = `${PROTOCOL}://${HOST}`;
const APP_URL = `${URL}${IS_PROD ? '' : `:${CLIENT_PORT}`}`;
// build api url
const API_PREFIX = '/api';
const APP_API_URL = IS_PROD
  ? `${PROTOCOL}://api.${HOST}`
  : `${URL}:${SERVER_PORT}${API_PREFIX}`;

// local storage keys
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
};

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
};

const NOTIFICATION_SHADOWS = {
  success: `0 0 10px ${PALETTE.primary}, 0 0 1px ${PALETTE.primary}`,
  error: `0 0 10px ${PALETTE.error}, 0 0 1px ${PALETTE.error}`,
  warning: `0 0 10px ${PALETTE.warning}, 0 0 1px ${PALETTE.warning}`,
  info: `0 0 10px ${PALETTE.info}, 0 0 1px ${PALETTE.info}`,
};

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
];

export default {
  APP_URL,
  APP_API_URL,
  THEME_CUSTOM_CSS_PROPS,
  THEME_COMPONENTS_WITH_CUSTOM_CSS_PROPS,
  PALETTE,
  NOTIFICATION_SHADOWS,
};
