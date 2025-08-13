import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import Chatprovider from './components/context/ChatProvider.jsx'
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')).render(
  < BrowserRouter >
    <ChakraProvider>
      < Chatprovider >

        <App />

      </Chatprovider >
    </ChakraProvider>

  </BrowserRouter >
)
