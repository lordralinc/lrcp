import React from 'react'

import { Div, FormItem, FormLayout, Group, Input } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { MasterApi } from '../../../api'
import { BasePanel } from '../../../components'
import { STORAGE_KEYS } from '../../../const'
import { IPanelProps } from '../../../types'
import { getApiConfig } from '../../../utils'

interface IServersNewPanelState {
  ip_address: string;
  grpc_port: number;
  client_name: string;
  master: { ip: string; port: number } | null;
}

interface ICheckResultField {
  result: boolean;
  reason: string;
}

interface ICheckResults {
  ip_address: ICheckResultField;
  grpc_port: ICheckResultField;
  client_name: ICheckResultField;
}

export class ServersNewPanel extends React.Component<IPanelProps,
  IServersNewPanelState> {
  constructor(props: IPanelProps) {
    super(props)
    this.state = {
      ip_address: '127.0.0.1',
      grpc_port: 4052,
      client_name: 'Server',
      master: null
    }
  }

  componentDidMount() {
    new MasterApi(getApiConfig())
      .getInfo()
      .then((response) => this.setState({ master: response.data }))
  }

  check(): ICheckResults {
    const validateIPv4 = (address: string) => {
      return /^((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)$/.test(
        address
      )
    }
    const validateIPv6 = (address: string) => {
      return /^(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}|([\da-fA-F]{1,4}:){1,7}:|([\da-fA-F]{1,4}:){1,6}:[\da-fA-F]{1,4}|([\da-fA-F]{1,4}:){1,5}(:[\da-fA-F]{1,4}){1,2}|([\da-fA-F]{1,4}:){1,4}(:[\da-fA-F]{1,4}){1,3}|([\da-fA-F]{1,4}:){1,3}(:[\da-fA-F]{1,4}){1,4}|([\da-fA-F]{1,4}:){1,2}(:[\da-fA-F]{1,4}){1,5}|[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,6})|:((:[\da-fA-F]{1,4}){1,7}|:)|fe80:(:[\da-fA-F]{0,4}){0,4}%[\da-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)|([\da-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d))$/.test(
        address
      )
    }
    const ip_address =
      validateIPv4(this.state.ip_address) ||
      validateIPv6(this.state.ip_address)

    const data = {
      ip_address: { result: true, reason: '' },
      grpc_port: { result: true, reason: '' },
      client_name: { result: true, reason: '' }
    } as ICheckResults

    if (!ip_address) {
      data.ip_address = { result: false, reason: 'IP адрес не валиден' }
    }

    if (this.state.client_name.length < 1) {
      data.client_name = { result: false, reason: 'Имя сервера не введено' }
    }

    if (this.state.client_name.length > 128) {
      data.client_name = {
        result: false,
        reason: 'Имя сервера не может быть больше 128 символов'
      }
    }

    if (this.state.grpc_port > 65536) {
      data.grpc_port = { result: false, reason: 'Слишком большой адрес порта' }
    }

    if (this.state.grpc_port < 1) {
      data.grpc_port = {
        result: false,
        reason: 'Слишком маленький адрес порта'
      }
    }

    return data
  }

  render() {
    const check = this.check()
    return (
      <BasePanel {...this.props} header="Добавить сервер" needBack>
        <Group>
          <FormLayout>
            <FormItem
              top="Имя сервера"
              status={check.client_name.result ? 'valid' : 'error'}
              bottom={check.client_name.reason}
            >
              <Input
                type="text"
                name="client_name"
                value={this.state.client_name}
                onChange={(e) =>
                  this.setState({ client_name: e.currentTarget.value })
                }
              />
            </FormItem>
            <FormItem
              top="IP адрес"
              status={check.ip_address.result ? 'valid' : 'error'}
              bottom={check.ip_address.reason}
            >
              <Input
                type="text"
                name="ip_address"
                value={this.state.ip_address}
                onChange={(e) =>
                  this.setState({ ip_address: e.currentTarget.value })
                }
              />
            </FormItem>
            <FormItem
              top="Порт GRPC"
              status={check.grpc_port.result ? 'valid' : 'error'}
              bottom={check.grpc_port.reason}
            >
              <Input
                type="text"
                name="grpc_port"
                value={this.state.grpc_port}
                onChange={(e) =>
                  this.setState({ grpc_port: parseInt(e.currentTarget.value) })
                }
              />
            </FormItem>
          </FormLayout>
        </Group>
        <Group>
          {this.state.master ? (
            <Div>
              <span>poetry run manage client setup </span>
              <span> --master_ip {this.state.master.ip} </span>
              <span> --master_port {this.state.master.port} </span>
              <span> --client_ip {this.state.ip_address} </span>
              <span> --client_port {this.state.grpc_port} </span>
              <span> --client_name &apos;{this.state.client_name}&apos; </span>
              <span>
                {' '}
                --token &apos;{localStorage.getItem(STORAGE_KEYS.TOKEN)}&apos;
              </span><br/>
            </Div>
          ) : (
            <Div>
              <Skeleton/>
            </Div>
          )}
        </Group>
      </BasePanel>
    )
  }
}
