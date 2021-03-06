import React, { Component, ReactEventHandler, MouseEvent } from 'react';
// import logo from './logo.svg';

import {connect} from 'react-redux'
import styles from './App.module.less';
import Launcher from '../components/launcher/index'
import ReactDOM from 'react-dom'
// import {message} from 'antd'
// import { Toast } from 'react-onsenui'
import {notification} from 'onsenui'
import {getAppList} from './appList'

import TopSearch from '../components/serach'
import TopWeather from '../components/weather'
import {createHashHistory} from 'history'
import {withRouter} from 'react-router'

const history = createHashHistory()

interface Istate {
  pointX: number,
  pointY: number,
  width: number,
  height: number,
  isFocus: boolean
}
interface Iporps {
  launcherList: Ilauncher[]
}


const runApps: any = {}

let divEmun: HTMLElement | null  = null

let enumShow: boolean = false

class App extends Component<Iporps, Istate> {

  state: Istate = {
    pointX: 0,
    pointY: 40,
    width: 0,
    height: 0,
    isFocus: false
  }

  constructor(props: Iporps) {
    super(props);
  }
  
  render() {
    const isMobile = window.innerWidth > 750
    if (isMobile) {
      return <div>请在移动端打开</div>
    }
    return (
      <div className={styles.App}>
        <div className={styles.header}>
          <div className={styles.searchInput}>
            <TopSearch/>
            <TopWeather/>
          </div>
        </div>
        <div className={styles.content}>
          {
            getAppList().map((v: Ilauncher, i) => {
              return (
                <Launcher key={i} {...v} onOpen={this.openLauncher.bind(this, v)}/>
              )
            })
          }
        </div>
      </div>
    )
  }

  componentDidMount () {
    history.listen(listener => {
      console.log(listener)
      if (listener.pathname === '/') {
        for (const key in runApps) {
          if (runApps.hasOwnProperty(key)) {
            const element = runApps[key];
            console.log(element)
            ReactDOM.unmountComponentAtNode(element.ele)
            element.ele.remove()
          }
        }
      }
    })
  }

  openLauncher (launcher: Ilauncher): void {
    if (!launcher.app) {
      notification.alert({
        message: `${launcher.title}未安装`,
        title: '提示'
      })
      return
    }


    const appId = Date.now().toString(16)
    if (runApps[appId]) {
      console.log('运行中...')
      return
    }

    const app: HTMLElement = document.createElement('div')
    app.setAttribute('id', appId)

    runApps[appId] = {
      ele: app,
      ...launcher
    }

    if (launcher.router) {
      console.log(history)
      history.push(launcher.router)
      // window.location.hash = launcher.router
    }

    ReactDOM.render(<launcher.app title={launcher.title} onClose={() => {
      ReactDOM.unmountComponentAtNode(app)
      app.remove()
      delete runApps[appId]
    }}/>, app)

    document.body.append(app)
  }

}

const mapState = (state: any) => {
  return {
    launcherList: state.launcherList
  }
} 

export default connect(mapState)(App);
