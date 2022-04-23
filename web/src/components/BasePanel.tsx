import React from 'react'

import { Footer, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'

import { DEBUG } from '../const'
import { InfoProps } from '../types'


export interface IBasePanelProps extends InfoProps {
  id: string;
  header?: string;
  needBack?: boolean;
}

export class BasePanel extends React.Component<IBasePanelProps, any> {
  render() {
    return (
      <Panel id={this.props.id}>
        {this.props.header && (
          <PanelHeader
            left={
              this.props.needBack && (
                <PanelHeaderBack
                  onClick={() => this.props.info.router.popPage()}
                />
              )
            }
          >
            {this.props.header}
          </PanelHeader>
        )}
        {this.props.children}
        {this.props.info.snackbar}
        <Footer>
          LR Control Panel | (c) 2022 lordralinc {DEBUG && ' | debug'}
        </Footer>
      </Panel>
    )
  }
}
