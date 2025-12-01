import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupMockAPI } from './core/http/mock-api'
import './i18n/config'

// Enable mock API for development
setupMockAPI()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
