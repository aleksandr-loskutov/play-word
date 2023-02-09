import { ConfigProvider, theme } from 'antd'
import AppRouter from './router/router'
import { AuthProvider } from './components/hooks/auth'
const { defaultAlgorithm, darkAlgorithm } = theme

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ConfigProvider>
    </div>
  )
}

export default App
