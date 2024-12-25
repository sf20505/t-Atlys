import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FunctionChain from './Modules/FunctionChain/FunctionChain'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FunctionChain />
  </StrictMode>,
)
