import React from 'react'

import { Div } from '@vkontakte/vkui'

import {
  GetServerResponse
} from '../../../../api'
import { CPULoadInfo, EthInterface, InfoCPU, InfoMemory, InfoNet, ServerSocket } from '../../../../sockets'
import { InfoProps } from '../../../../types'
import { getApiConfig, rslice } from '../../../../utils'
import {
  CPUMonitor,
  CPUMonitorSkeleton,
  MemoryMonitor,
  MemoryMonitorSkeleton,
  NetMonitor,
  NetMonitorSkeleton
} from './monitorBlocks'

interface IMonitorTabProps extends InfoProps {
  server: GetServerResponse;
  tabActive: boolean;
}

interface IMonitorTabState {
  messages: string[];
  memoryInfo?: InfoMemory;
  memoryInfoHistory: {memory: number, swap: number, date: Date}[]
  CPUInfo?: InfoCPU
  CPUInfoHistory: { cores: { cpu: string, load: number }[], date: Date}[]
  NetInfo?: InfoNet
  NetInfoHistory: { interfaces: { interfaceName: string, tx: number, rx: number }[], date: Date}[]
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
      CPUInfoHistory: [],
      NetInfoHistory: []
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
      this.ws.socket.close()
    }

    if (this.state.CPUInfo && prevState.CPUInfo && this.state.CPUInfo != prevState.CPUInfo) {
      const calcCPUHistory = () => {
        const calcLoad = (curr: CPULoadInfo, last: CPULoadInfo) => {
          const currIdle = curr.idle + curr.iowait
          const currProcess = curr.user + curr.nice + curr.system + curr.irq + curr.soft_irq + curr.steal
          const lastIdle = last.idle + last.iowait
          const lastProcess = last.user + last.nice + last.system + last.irq + last.soft_irq + last.steal
          return (currProcess - lastProcess) / ((currIdle + currProcess) - (lastIdle + lastProcess))
        }

        const curr = this.state.CPUInfo!.all_load!
        const last = prevState.CPUInfo!.all_load!
        const cores = []

        cores.push({
          cpu: "Общая загрузка",
          load: calcLoad(curr, last)
        })
        prevState.CPUInfo!.load.forEach((v, i) => {
          cores.push({
            cpu: `[${prevState.CPUInfo!.cores[i].core_id}] ${prevState.CPUInfo!.cores[i].model_name}`,
            load: calcLoad(prevState.CPUInfo!.load[i], this.state.CPUInfo!.load[i])
          })
        })
        return {cores: cores, date: new Date()}
      }


      this.setState({
        CPUInfoHistory: [...rslice(this.state.CPUInfoHistory, 19), calcCPUHistory()]
      })
    }

    if (this.state.NetInfo && prevState.NetInfo && this.state.NetInfo != prevState.NetInfo) {
      const searchInterface = (_interfaces: EthInterface[], name: string) => {
        return _interfaces.filter(v => {return v.name == name})[0]
      }
      const interfaces = [] as { interfaceName: string, tx: number, rx: number }[]
      this.state.NetInfo.interfaces.forEach((value) => {
        const lastInt = searchInterface(prevState.NetInfo!.interfaces!, value.name)
        interfaces.push({
          interfaceName: value.name,
          rx: value.receive.bytes - lastInt.receive.bytes,
          tx: value.transmit.bytes - lastInt.transmit.bytes
        })
      })
      this.setState({
        NetInfoHistory: rslice([...this.state.NetInfoHistory, {interfaces: interfaces, date: new Date()}], 20)
      })
    }
  }

  createWS() {
    this.ws = new ServerSocket(getApiConfig().accessToken! as string)
    this.ws.socket.connect()
    this.ws.socket.emit('enter', {server_id: this.props.server.id})
    this.ws.onMemoryInfo((data) => {
      this.setState({memoryInfo: data, memoryInfoHistory: [...rslice(this.state.memoryInfoHistory, 19), { memory: data.mem_total! - data.mem_free! || 0, swap: data.swap_total! - data.swap_free! || 0, date: new Date() }]})
    })
    this.ws.onCPUInfo(data => {
      this.setState({
        CPUInfo: data
      })
    })
    this.ws.onNetInfo(data => {
      this.setState({
        NetInfo: data
      })
    })
  }

  componentWillUnmount() {
    this.ws?.socket.close()
  }

  render() {
    return (
      <>
        <Div>
          {this.state.CPUInfo && this.state.CPUInfoHistory
            ? <CPUMonitor CPUInfoHistory={this.state.CPUInfoHistory} CPUInfo={this.state.CPUInfo!} />
            : <CPUMonitorSkeleton />
          }
        </Div>
        <Div>
          {this.state.memoryInfo
            ? <MemoryMonitor memoryInfoHistory={this.state.memoryInfoHistory} memoryInfo={this.state.memoryInfo} />
            : <MemoryMonitorSkeleton />
          }
        </Div>
        <Div>
          {this.state.NetInfo
            ? <NetMonitor NetInfoHistory={this.state.NetInfoHistory} MetInfo={this.state.NetInfo} />
            : <NetMonitorSkeleton />
          }
        </Div>
      </>

    )
  }
}
