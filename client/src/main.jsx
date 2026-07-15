import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from './context/SocketContext.jsx';

import './index.css'
import App from './App.jsx'

import { queryClient } from './lib/queryClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </SocketProvider>
    
  </StrictMode>,
)
