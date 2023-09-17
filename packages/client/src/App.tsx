import React, { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './components/hooks/auth';
import CONSTS from './utils/consts';
import generateThemeConfig from './utils/generate-theme-config';
import AppInitializer from './components/app-initializer/appInitializer';

const generateTheme = () => ({
  algorithm: theme.darkAlgorithm,
  components: generateThemeConfig(
    CONSTS.THEME_COMPONENTS_WITH_CUSTOM_CSS_PROPS,
    CONSTS.THEME_CUSTOM_CSS_PROPS
  ),
});

function App(): React.ReactElement {
  const themeConfig = useMemo(() => generateTheme(), []);

  return (
    <div className="App">
      <ConfigProvider theme={themeConfig}>
        <AuthProvider>
          <AppInitializer />
        </AuthProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
