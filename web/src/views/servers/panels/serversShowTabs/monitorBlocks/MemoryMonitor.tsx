import React from 'react'

import { Card, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { MemoryMonitor } from '../components'

interface IMemoryMonitorProps {
  memoryInfoHistory: { memory: number, swap: number, date: Date }[]
}

export class MemoryMonitorSkeleton extends React.Component<any, any> {
  render() {
    return (
      <Card style={{ padding: '10px 5px 20px 10px' }}>
        <Title level="1" style={{ textAlign: 'center' }}>Память</Title>
        <div style={{ width: '100%' }}>
          <Skeleton height="400px"/>
        </div>
      </Card>
    )
  }
}

export class MemoryMonitorBlock extends React.Component<IMemoryMonitorProps, any> {
  render() {
    return (
      <Card style={{ padding: '10px 5px 20px 10px' }}>
        <Title level="1" style={{ textAlign: 'center' }}>Память</Title>
        <div style={{ width: '100%' }}>
          <MemoryMonitor
            height={400}
            data={this.props.memoryInfoHistory}
          />
        </div>
      </Card>
    )
  }
}
