import React from 'react'

import { Div } from '@vkontakte/vkui'

import { GetServerResponse } from '../../../../api'
import { CPULoadInfo, EthInterface, InfoCPU, InfoMemory, InfoNet, ServerSocket } from '../../../../sockets'
import { InfoProps } from '../../../../types'
import { getApiConfig, rslice } from '../../../../utils'
import {
  CPUMonitorBlock,
  CPUMonitorSkeleton,
  MemoryMonitorBlock,
  MemoryMonitorSkeleton,
  NetMonitorBlock,
  NetMonitorSkeleton
} from './monitorBlocks'

interface IMonitorTabProps extends InfoProps {
  server: GetServerResponse;
  tabActive: boolean;
}

interface IMonitorTabState {
  messages: string[];
  memoryInfo?: InfoMemory;
  memoryInfoHistory: { memory: number, swap: number, date: Date }[]
  cpuInfo?: InfoCPU
  cpuInfoHistory: { cores: { cpu: string, load: number }[], date: Date }[]
  netInfo?: InfoNet
  netInfoHistory: { interfaces: { interfaceName: string, tx: number, rx: number }[], date: Date }[]
}


export class MonitorTab extends React.Component<IMonitorTabProps,
  IMonitorTabState> {
  private ws: ServerSocket | null
  private interval: any | null

  constructor(props: IMonitorTabProps) {
    super(props)
    this.state = {
      messages: [],
      memoryInfoHistory: [],
      cpuInfoHistory: [],
      netInfoHistory: []
    }
    this.ws = null
    this.interval = null
  }

  componentDidMount() {
    this.createWS()
  }

  componentDidUpdate(
    prevProps: Readonly<IMonitorTabProps>,
    prevState: Readonly<IMonitorTabState>,
    snapshot?: any
  ) {

    if (this.props.tabActive && !this.ws) {
      this.createWS()
    }

    if (!this.props.tabActive && this.ws) {
      this.ws.socket.emit('exit', { server_id: this.props.server.id })
      this.ws.socket.close()
    }

    if (this.state.cpuInfo && prevState.cpuInfo && this.state.cpuInfo != prevState.cpuInfo) {
      const calcCPUHistory = () => {
        const calcLoad = (curr: CPULoadInfo, last: CPULoadInfo) => {
          const currIdle = curr.idle + curr.iowait
          const currProcess = curr.user + curr.nice + curr.system + curr.irq + curr.soft_irq + curr.steal
          const lastIdle = last.idle + last.iowait
          const lastProcess = last.user + last.nice + last.system + last.irq + last.soft_irq + last.steal
          return (currProcess - lastProcess) / ((currIdle + currProcess) - (lastIdle + lastProcess))
        }

        const curr = this.state.cpuInfo!.all_load!
        const last = prevState.cpuInfo!.all_load!
        const cores = []

        cores.push({
          cpu: 'Общая загрузка',
          load: calcLoad(curr, last)
        })
        prevState.cpuInfo!.load.forEach((v, i) => {
          cores.push({
            cpu: `[${prevState.cpuInfo!.cores[i].core_id}] ${prevState.cpuInfo!.cores[i].model_name}`,
            load: calcLoad(prevState.cpuInfo!.load[i], this.state.cpuInfo!.load[i])
          })
        })
        return { cores: cores, date: new Date() }
      }


      this.setState({
        cpuInfoHistory: [...rslice(this.state.cpuInfoHistory, 19), calcCPUHistory()]
      })
    }

    if (this.state.netInfo && prevState.netInfo && this.state.netInfo != prevState.netInfo) {
      const searchInterface = (_interfaces: EthInterface[], name: string) => {
        return _interfaces.filter(v => {
          return v.name == name
        })[0]
      }
      const interfaces = [] as { interfaceName: string, tx: number, rx: number }[]
      this.state.netInfo.interfaces.forEach((value) => {
        const lastInt = searchInterface(prevState.netInfo!.interfaces!, value.name)
        interfaces.push({
          interfaceName: value.name,
          rx: (value.receive.bytes - lastInt.receive.bytes) / 5,
          tx: (value.transmit.bytes - lastInt.transmit.bytes) / 5
        })
      })
      this.setState({
        netInfoHistory: rslice([...this.state.netInfoHistory, { interfaces: interfaces, date: new Date() }], 20)
      })
    }
  }

  createWS() {
    this.ws = new ServerSocket(getApiConfig().accessToken! as string)
    this.ws.socket.connect()
    this.ws.socket.emit('enter', { server_id: this.props.server.id })
    this.ws.onMemoryInfo((data) => {
      this.setState({ memoryInfo: data,
        memoryInfoHistory: [...rslice(this.state.memoryInfoHistory, 19), {
          memory: data.mem_total! - data.mem_available! || 0,
          swap: data.swap_total! - data.swap_free! || 0,
          date: new Date()
        }]
      })
    })
    this.ws.onCPUInfo(data => {
      this.setState({
        cpuInfo: data
      })
    })
    this.ws.onNetInfo(data => {
      this.setState({
        netInfo: data
      })
    })
  }

  componentWillUnmount() {
    this.ws?.socket.emit('exit', { server_id: this.props.server.id })
    this.ws?.socket.close()
  }

  render() {
    return (
      <>
        <Div>
          {this.state.cpuInfo && this.state.cpuInfoHistory
            ? <CPUMonitorBlock cpuInfoHistory={this.state.cpuInfoHistory} cpuInfo={this.state.cpuInfo!}/>
            : <CPUMonitorSkeleton/>
          }
        </Div>
        <Div>
          {this.state.memoryInfo
            ? <MemoryMonitorBlock memoryInfoHistory={this.state.memoryInfoHistory}/>
            : <MemoryMonitorSkeleton/>
          }
        </Div>
        <Div>
          {this.state.netInfo
            ? <NetMonitorBlock NetInfoHistory={this.state.netInfoHistory} MetInfo={this.state.netInfo}/>
            : <NetMonitorSkeleton/>
          }
        </Div>
      </>

    )
  }
}
