import { Theme } from 'antd/lib/config-provider/context'

const themes: { [key: string]: Theme } = {
  default: {},
}

export const themeList = Object.keys(themes).map(theme => ({
  label: theme,
  value: theme,
}))

export default themes
