import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Demo from './demo/index'

import { FocusProvider } from './demo/use-focus'

ReactDOM.render(
  <FocusProvider>
    <Demo />
  </FocusProvider>,
  document.getElementById('root')
)
