import React, { Component } from 'react'
import styles from './index.modules.less'
import Router from './router'
import {HashRouter} from 'react-router-dom'
import Window from '../../components/window'

export default class WechatApp extends Component<any> {
  render() {
    const {title, onClose} = this.props
    return (
        <Window title={title} onClose={onClose} isAbleFull={false}>
            <div className={styles['wechat-app']}>
                <HashRouter>
                    {Router}
                </HashRouter>
            </div>            
        </Window>
    )
  }
}
