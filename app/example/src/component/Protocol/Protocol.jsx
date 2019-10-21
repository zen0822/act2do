/**
 * @prop {String} src - 协议的静态资源超链接地址
 */

import './Protocol.scss'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const compPrefix = 'comp-protocol'

class CompProtocol extends Component {
  constructor(props) {
    super(props)

    this.state = {
      protocolFileHeight: 0
    }
  }

  componentDidMount() {
    this.setState({
      protocolFileHeight: 0
    })
  }

  render() {
    return (
      <div className={compPrefix}>
        <iframe
          width='100%'
          height={`${this.state.protocolFileHeight}px`}
          frameBorder='0'
          onLoad={(event) => {
            this.setState({
              protocolFileHeight: ReactDOM.findDOMNode(event.currentTarget).contentWindow.document.body.scrollHeight
            })
          }}
          scrolling='no'
          src={this.props.src}
        ></iframe>
      </div>
    )
  }
}

CompProtocol.defaultProps = {
  src: ''
}

CompProtocol.propTypes = {
  src: PropTypes.string
}

export default CompProtocol
