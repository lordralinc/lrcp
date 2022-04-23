import React from 'react'

import { BaseView } from '../../components'
import { PANEL_IDS } from '../../const'
import { IViewProps } from '../../types'
import { MasterHomePanel } from './panels'

export class MasterView extends React.Component<IViewProps, any> {
  render() {
    return (
      <BaseView id={this.props.id} info={this.props.info}>
        <MasterHomePanel id={PANEL_IDS.MASTER_HOME} info={this.props.info}/>
      </BaseView>
    )
  }
}
