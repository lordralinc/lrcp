import React from 'react'

import { Card, Div, SegmentedControl, SegmentedControlOptionInterface, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import {
  ServersApi,
  ServersGetCpuStatisticsResponse,
  ServersGetNetworkStatisticsResponse,
  ServersGetRAMStatisticsResponse,
  StatisticType
} from '../../../../api'
import { getApiConfig, toFixed } from '../../../../utils'
import { CpuMonitor, MemoryMonitor, NetMonitor } from './components'

interface IStatisticsTabProps {
  server_id: number
}

interface IStatisticsTabState {
  cpu: { [key: string]: ServersGetCpuStatisticsResponse[] }
  cpuState: string
  memory: { [key: string]: ServersGetRAMStatisticsResponse[] }
  memoryState: string
  net: { [key: string]: ServersGetNetworkStatisticsResponse[] }
  netState: string
}

export class StatisticsTab extends React.Component<IStatisticsTabProps, IStatisticsTabState> {
  constructor(props: IStatisticsTabProps) {
    super(props)
    this.state = {
      cpu: {},
      net: {},
      memory: {},
      cpuState: StatisticType._5,
      netState: StatisticType._5,
      memoryState: StatisticType._5
    }
  }

  getCPUStatistics(type: StatisticType) {
    new ServersApi(getApiConfig()).getCPUStatistics(this.props.server_id, type)
      .then(r => this.setState({ cpu: { ...this.state.cpu, [type]: r.data } }))
  }

  getNetStatistics(type: StatisticType) {
    new ServersApi(getApiConfig()).getNetworkStatistics(this.props.server_id, type)
      .then(r => this.setState({ net: { ...this.state.net, [type]: r.data } }))
  }

  getMemoryStatistics(type: StatisticType) {
    new ServersApi(getApiConfig()).getRAMStatistics(this.props.server_id, type)
      .then(r => this.setState({ memory: { ...this.state.memory, [type]: r.data } }))
  }

  componentDidMount() {
    this.getCPUStatistics(StatisticType._5)
    this.getNetStatistics(StatisticType._5)
    this.getMemoryStatistics(StatisticType._5)
  }

  formatDate(statisticType: StatisticType): (dt: Date) => string {
    const tf = toFixed
    const lambdas = {
      [StatisticType._5]: (dt: Date) => `${tf(dt.getHours())}:${tf(dt.getMinutes())}`,
      [StatisticType._15]: (dt: Date) => `${tf(dt.getHours())}:${tf(dt.getMinutes())}`,
      [StatisticType._30]: (dt: Date) => `${tf(dt.getHours())}:${tf(dt.getMinutes())}`,
      [StatisticType.H]: (dt: Date) => `${tf(dt.getHours())}:${tf(dt.getMinutes())}`,
      [StatisticType.D]: (dt: Date) => `${tf(dt.getDate())}.${tf(dt.getMonth())}.${dt.getFullYear()}`,
      [StatisticType.W]: (dt: Date) => `${tf(dt.getDate())}.${tf(dt.getMonth())}.${dt.getFullYear()}`,
      [StatisticType.M]: (dt: Date) => `${tf(dt.getDate())}.${tf(dt.getMonth())}.${dt.getFullYear()}`
    } as any
    return lambdas[statisticType]
  }

  render() {
    const statisticTabsOptions = [
      { label: '5м', value: StatisticType._5 },
      { label: '15м', value: StatisticType._15 },
      { label: '30м', value: StatisticType._30 },
      { label: '1ч', value: StatisticType.H },
      { label: '1д', value: StatisticType.D },
      { label: '1н', value: StatisticType.W },
      { label: '1м', value: StatisticType.M }
    ]
    return (
      <>
        <Div>
          <Card style={{ padding: '10px 5px 20px 10px' }}>
            <Title level="1" style={{ textAlign: 'center' }}>CPU</Title>

            <SegmentedControl
              options={statisticTabsOptions as SegmentedControlOptionInterface[]}
              value={this.state.cpuState}
              onChange={value => {
                this.setState({ cpuState: value!.toString() })
                this.getCPUStatistics(value!.toString() as StatisticType)
              }}
            />
            {!(this.state.cpuState in this.state.cpu) || this.state.cpu[this.state.cpuState] === undefined
              ? <Skeleton height={400}/>
              : <CpuMonitor
                data={this.state.cpu[this.state.cpuState].map(v => {
                  return { date: new Date(v.date), cores: v.info }
                })}
                height={400}
                dateFormatter={this.formatDate(this.state.cpuState as StatisticType)}
              />
            }
          </Card>
        </Div>
        <Div>
          <Card style={{ padding: '10px 5px 20px 10px' }}>
            <Title level="1" style={{ textAlign: 'center' }}>RAM</Title>

            <SegmentedControl
              options={statisticTabsOptions as SegmentedControlOptionInterface[]}
              value={this.state.memoryState}
              onChange={value => {
                this.setState({ memoryState: value!.toString() })
                this.getMemoryStatistics(value!.toString() as StatisticType)
              }}
            />
            {!(this.state.memoryState in this.state.memory) || this.state.memory[this.state.memoryState] === undefined
              ? <Skeleton height={400}/>
              : <MemoryMonitor
                data={this.state.memory[this.state.memoryState].map(v => {
                  return { date: new Date(v.date), memory: v.info.mem, swap: v.info.swap }
                })}
                height={400}
                dateFormatter={this.formatDate(this.state.memoryState as StatisticType)}
              />
            }
          </Card>
        </Div>
        <Div>
          <Card style={{ padding: '10px 5px 20px 10px' }}>
            <Title level="1" style={{ textAlign: 'center' }}>Сеть</Title>

            <SegmentedControl
              options={statisticTabsOptions as SegmentedControlOptionInterface[]}
              value={this.state.netState}
              onChange={value => {
                this.setState({ netState: value!.toString() })
                this.getNetStatistics(value!.toString() as StatisticType)
              }}
            />
            {!(this.state.netState in this.state.net) || this.state.net[this.state.netState] === undefined
              ? <Skeleton height={400}/>
              : <NetMonitor
                data={this.state.net[this.state.netState].map(v => {
                  return { date: new Date(v.date), interfaces: v.info }
                })}
                height={400}
                dateFormatter={this.formatDate(this.state.netState as StatisticType)}
              />
            }
          </Card>
        </Div>
      </>
    )
  }
}
