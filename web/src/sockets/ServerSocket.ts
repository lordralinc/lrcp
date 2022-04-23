import io, { Manager, Socket } from 'socket.io-client'

import { BASE_PATH } from '../api/base'
import { EventTypeEnum, InfoCPU, InfoMemory, InfoNet } from './types'

export class ServerSocket {
  public readonly url: string
  private readonly accessToken: string
  public manager: Manager
  public socket: Socket

  constructor(accessToken: string) {
    this.url = BASE_PATH
    this.accessToken = accessToken
    this.manager = new Manager(this.url, {path: '/ws/socket.io'})
    this.socket = this.manager.socket('/', {
      auth: {token: this.accessToken, }
    })
  }

  onMemoryInfo(lis: (data: InfoMemory) => void) {
    this.socket.on(EventTypeEnum.InfoMemory, lis)
  }

  onCPUInfo(lis: (data: InfoCPU) => void) {
    this.socket.on(EventTypeEnum.InfoCPU, lis)
  }

  onNetInfo(lis: (data: InfoNet) => void) {
    this.socket.on(EventTypeEnum.InfoNet, lis)
  }

}
