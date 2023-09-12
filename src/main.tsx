import ReactDOM from 'react-dom/client'
import { GlobalProvider } from './Context.tsx';
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
)

postMessage({ payload: 'removeLoading' }, '*')
