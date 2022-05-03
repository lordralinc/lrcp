import React from 'react'

import { Card, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { InfoCPU } from '../../../../../sockets'
import { CpuMonitor } from '../components'

interface ICPUMonitorProps {
  cpuInfo: InfoCPU
  cpuInfoHistory: { cores: { cpu: string, load: number }[], date: Date }[]
}

export class CPUMonitorSkeleton extends React.Component<any, any> {
  render() {
    return (
      <Card style={{ padding: '10px 5px 20px 10px' }}>
        <Title level="1" style={{ textAlign: 'center' }}>CPU</Title>
        <div style={{ width: '100%' }}>
          <Skeleton height="400px"/>
        </div>
      </Card>
    )
  }
}

export class CPUMonitorBlock extends React.Component<ICPUMonitorProps, any> {
  render() {
    return (
      <>
        <Card style={{ padding: '10px 5px 20px 10px' }}>
          <Title level="1" style={{ textAlign: 'center' }}>CPU</Title>
          <div style={{ width: '100%' }}>
            <CpuMonitor
              data={this.props.cpuInfoHistory.map(record => {
                return {
                  date: record.date, cores: record.cores.map(cpu => {
                    return { name: cpu.cpu, load: cpu.load }
                  })
                }
              })}
              height={400}
            />
          </div>
        </Card>
      </>
    )
  }
}
