import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'
import { GOOGLE_CLIENT_ID } from './config/google-oauth'
import { LanguageProvider } from './i18n/LanguageContext'

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  background: 'hsl(240 8% 8%)',
                  border: '1px solid hsl(240 5% 20%)',
                  color: 'hsl(0 0% 98%)',
                },
              }}
            />
          </QueryClientProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
