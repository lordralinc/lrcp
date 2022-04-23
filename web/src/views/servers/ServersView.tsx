import React from 'react'

import { BaseView } from '../../components'
import { PANEL_IDS } from '../../const'
import { IViewProps } from '../../types'
import { ServersHomePanel, ServersNewPanel, ServersShowPanel } from './panels'

export class ServersView extends React.Component<IViewProps, any> {
  render() {
    return (
      <BaseView id={this.props.id} info={this.props.info}>
        <ServersHomePanel id={PANEL_IDS.SERVERS_HOME} info={this.props.info}/>
        <ServersNewPanel id={PANEL_IDS.SERVERS_NEW} info={this.props.info}/>
        <ServersShowPanel id={PANEL_IDS.SERVERS_SHOW} info={this.props.info}/>
      </BaseView>
    )
  }
}
