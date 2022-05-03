import React from 'react'

import { Card, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { InfoNet } from '../../../../../sockets'
import { NetMonitor } from '../components'


interface INetMonitorProps {
  MetInfo: InfoNet
  NetInfoHistory: { interfaces: { interfaceName: string, tx: number, rx: number }[], date: Date }[]
}

interface INetMonitorState {
}

export class NetMonitorSkeleton extends React.Component<any, any> {
  render() {
    return (
      <Card style={{ padding: '10px 5px 20px 10px' }}>
        <Title level="1" style={{ textAlign: 'center' }}>Сеть</Title>
        <div style={{ width: '100%' }}>
          <Skeleton height="400px"/>
        </div>
      </Card>
    )
  }
}

export class NetMonitorBlock extends React.Component<INetMonitorProps, INetMonitorState> {

  render() {
    return (
      <>
        <Card style={{ padding: '10px 5px 20px 10px' }}>
          <Title level="1" style={{ textAlign: 'center' }}>Сеть</Title>
          <div style={{ width: '100%' }}>
            <NetMonitor
              height={400}
              data={this.props.NetInfoHistory.map(h => {
                return {
                  date: h.date, interfaces: h.interfaces.map(i => {
                    return { name: i.interfaceName, tx: i.tx, rx: i.rx }
                  })
                }
              })}
            />
          </div>
        </Card>
      </>
    )
  }
}
