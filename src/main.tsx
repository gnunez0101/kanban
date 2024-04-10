import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StoreProvider } from './components/Store.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  // </React.StrictMode>,
)
