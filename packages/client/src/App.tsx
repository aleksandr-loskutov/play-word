import React from 'react'
import { ConfigProvider, theme } from 'antd'
import AppRouter from './router/router'
import { AuthProvider } from './components/hooks/auth'
import CONSTS from '../src/utils/consts'
import generateThemeConfig from './utils/generate-theme-config'
import AppInitializer from './components/app-initializer/appInitializer'

const { darkAlgorithm } = theme

const App: React.FC = () => {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
          components: generateThemeConfig(
            CONSTS.THEME_COMPONENTS_WITH_CUSTOM_CSS_PROPS,
            CONSTS.THEME_CUSTOM_CSS_PROPS
          ),
        }}>
        <AuthProvider>
          <AppInitializer />
        </AuthProvider>
      </ConfigProvider>
    </div>
  )
}

export default App
