import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from "@/redux/store";
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster richColors visibleToasts={1}/>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
