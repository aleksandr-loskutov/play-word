import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import 'antd/dist/reset.css'
import { BrowserRouter } from 'react-router-dom'

// function startServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker
//         .register('/sw.js')
//         .then(registration => {
//           console.log(
//             'ServiceWorker registration successful with scope: ',
//             registration.scope
//           )
//         })
//         .catch((error: string) => {
//           console.log('ServiceWorker registration failed: ', error)
//         })
//     })
//   }
// }
//
// startServiceWorker()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
