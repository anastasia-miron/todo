import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { Slide, ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </BrowserRouter>
)
