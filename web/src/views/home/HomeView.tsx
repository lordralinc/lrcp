import React from 'react'

import { BaseView } from '../../components'
import { PANEL_IDS } from '../../const'
import { IViewProps } from '../../types'
import { HomeHomePanel } from './panels'

export class HomeView extends React.Component<IViewProps, any> {
  render() {
    return (
      <BaseView id={this.props.id} info={this.props.info}>
        <HomeHomePanel id={PANEL_IDS.HOME_HOME} info={this.props.info}/>
      </BaseView>
    )
  }
}
