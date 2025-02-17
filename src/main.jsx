
// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthContextProvider } from './contexts/AppContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
  // </React.StrictMode>,
)
