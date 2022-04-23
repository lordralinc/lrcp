import React from 'react'

import { BaseView } from '../../components'
import { PANEL_IDS } from '../../const'
import { IViewProps } from '../../types'
import { SettingsHomePanel } from './panels'

export class SettingsView extends React.Component<IViewProps, any> {
  render() {
    return (
      <BaseView id={this.props.id} info={this.props.info}>
        <SettingsHomePanel
          id={PANEL_IDS.SETTINGS_HOME}
          info={this.props.info}
        />
      </BaseView>
    )
  }
}
