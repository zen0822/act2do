/**
 * the main file that the client of app
 */

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { render } from 'react-dom'
import React, { useState } from 'react'

const Detail: React.FC = (): React.ReactElement => {
  document.title = '详情'
  const [inputVal, setInputVal] = useState(1)

  return (
    <div
      key='pageDetail'
      onClick={(): void => setInputVal(inputVal === 1 ? 2 : 1)}
    >
      {inputVal === 1
        ? [
          <div key='a'>A</div>,
          <div key='b'>B</div>
        ] : [
          <div key='b'>B</div>,
          <div key='a'>A</div>
        ]
      }

    </div>
  )
}

render(<Detail />, document.getElementById('app'))
