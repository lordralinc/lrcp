import React from 'react'

import ReactDOM from 'react-dom'

import { App } from './App'
import { ROUTER } from './const'

ROUTER.start()
ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)

if (process.env.NODE_ENV === 'development') import('./eruda')
