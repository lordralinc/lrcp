import React from 'react'

import { View } from '@vkontakte/vkui'

import { ApplicationInfo } from '../ApplicationInfo'

export interface IBaseViewProps {
  id: string;
  info: ApplicationInfo;
  children: JSX.Element | JSX.Element[] | null;
}

export class BaseView extends React.Component<IBaseViewProps, any> {
  render() {
    return (
      <View
        id={this.props.id}
        key={'viewKey' + this.props.id}
        onSwipeBack={() => this.props.info.router.popPage()}
        history={
          this.props.info.location.hasOverlay()
            ? []
            : this.props.info.location.getViewHistory(this.props.id)
        }
        activePanel={this.props.info.location.getPanelId()}
      >
        {this.props.children}
      </View>
    )
  }
}
