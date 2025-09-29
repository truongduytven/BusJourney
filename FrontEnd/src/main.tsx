import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from "@/redux/store";
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster richColors visibleToasts={1} position='top-right' toastOptions={{
            duration: 3000,
            style: { fontSize: '14px'},
          }}/>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
