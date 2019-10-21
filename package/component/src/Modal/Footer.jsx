/**
 * 模态框的尾部组件
 *
 * @prop {Boolean} isFull
 * @prop {String} noBtn
 * @prop {String} okBtn
 * @prop {String} type
 *
 * @event ok
 * @event no
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Btn from '../Btn/Btn'
import { xclass } from '../../util/comp'

export default function (props) {
    const _xclass = (className) => {
        return xclass('modal', className)
    }

    const footerClass = props.footerDisplay ? '' : _xclass('no-footer')

    return (
        <footer
            className={footerClass}
        >
            {props.type !== 'alert' && props.noBtn && (
                <Btn
                    theme={props.theme}
                    kind={props.theme}
                    initVal={props.noBtn}
                    type='flat'
                    kind='default'
                    onClick={props.no}
                    radius='L'
                    size='M'
                    className={_xclass('cancel-btn')}
                />
            )}

            {props.okBtn && (
                <Btn
                    theme={props.theme}
                    kind={props.theme}
                    initVal={props.okBtn}
                    type='flat'
                    onClick={props.ok}
                    radius='L'
                    size='M'
                />
            )}
        </footer>
    )
}
