import React from 'react'

import { BaseView } from '../../components'
import { PANEL_IDS } from '../../const'
import { IViewProps } from '../../types'
import { AuthHomePanel } from './panels'

export class AuthView extends React.Component<IViewProps, any> {
  render() {
    return (
      <BaseView id={this.props.id} info={this.props.info}>
        <AuthHomePanel id={PANEL_IDS.AUTH_HOME} info={this.props.info}/>
      </BaseView>
    )
  }
}
