import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const container = document.getElementById('react-container')
const root = createRoot(container)
root.render(<App />)
