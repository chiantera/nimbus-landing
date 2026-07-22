import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import './index.css'
import App from './App.tsx'

// import.meta.env.BASE_URL is '/' on Vercel/local and '/nimbus-landing/' on GitHub Pages,
// so router paths stay correct on both hosts.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
