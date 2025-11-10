import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./main.css"
import { AuthProvider } from './Auth/auth.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')).render(
  

      <CookiesProvider>
          <App />
      </CookiesProvider>


)
