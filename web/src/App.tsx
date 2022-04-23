import '@vkontakte/vkui/dist/vkui.css'
import './css/index.css'

import React from 'react'

import { RouterContext } from '@happysanta/router'
import { AppearanceType } from '@vkontakte/vk-bridge'
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui'

import Application from './Application'
import { ROUTER, STORAGE_KEYS } from './const'

export class App extends React.Component<any, { appearance: AppearanceType }> {
  constructor(props: any) {
    super(props)
    this.state = {
      appearance:
        (localStorage.getItem(STORAGE_KEYS.THEME) as AppearanceType) || 'dark'
    }
  }

  render() {
    return (
      <ConfigProvider platform={'android'} appearance={this.state.appearance}>
        <AppRoot>
          <AdaptivityProvider>
            <RouterContext.Provider value={ROUTER}>
              <Application
                appearance={this.state.appearance}
                setAppearance={(appearance: AppearanceType) => {
                  this.setState({ appearance })
                  localStorage.setItem(STORAGE_KEYS.THEME, appearance)
                }}
              />
            </RouterContext.Provider>
          </AdaptivityProvider>
        </AppRoot>
      </ConfigProvider>
    )
  }
}
