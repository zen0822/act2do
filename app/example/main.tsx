/**
 * the main file that the client of app
 */

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as React from 'react'
import { render } from 'react-dom'
import App from './App/App'

render(<App />, document.getElementById('app'))
