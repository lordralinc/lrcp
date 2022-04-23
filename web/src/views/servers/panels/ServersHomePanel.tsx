import React from 'react'

import {
  Button,
  Div,
  FormItem,
  FormLayout,
  Group,
  Input,
  List,
  Placeholder,
  PullToRefresh,
  RichCell,
  SegmentedControl,
  Spacing
} from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { APIError, APIExceptionType, GetServerResponse, ServersApi } from '../../../api'
import { BasePanel } from '../../../components'
import { URLS } from '../../../const'
import { IPanelProps } from '../../../types'
import { getApiConfig } from '../../../utils'

class ServersSceleton extends React.Component<any, any> {
  render() {
    const part = (
      <RichCell
        caption={
          <div>
            ID: <Skeleton/>
          </div>
        }
      >
        <Skeleton/>
      </RichCell>
    )

    return (
      <List>
        {part}
        {part}
        {part}
      </List>
    )
  }
}

interface IServersHomePanelState {
  servers: Array<GetServerResponse> | null;
  isFetching: boolean;
  searchString: string;
  onlineStatus: 'all' | 'online' | 'offline';
}

export class ServersHomePanel extends React.Component<IPanelProps,
  IServersHomePanelState> {
  constructor(props: IPanelProps) {
    super(props)
    this.state = {
      servers: null,
      isFetching: false,
      searchString: '',
      onlineStatus: 'all'
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.renderServers = this.renderServers.bind(this)
  }

  componentDidMount() {
    this.onRefresh()
  }

  onRefresh(needSetFetching: boolean = false) {
    if (needSetFetching) this.setState({ isFetching: true })
    new ServersApi(getApiConfig())
      .getServers()
      .then((r) => {
        this.setState({ servers: r.data })
      })
      .catch((reason) => {
        const errorData = reason.response.data as APIError
        if (errorData.type === APIExceptionType.NotFound) {
          this.props.info.setErrorSnackbar('Сервер не найден')
          this.props.info.router.pushPage(URLS.SERVERS_HOME)
        }
      })
      .finally(() => {
        this.setState({ isFetching: false })
      })
  }

  renderServers() {
    const servers = this.state.servers
      ?.filter((v) => {
        if (this.state.searchString === '') return true
        return (
          `${v.id}${v.name.toLowerCase()}`.indexOf(
            this.state.searchString.toLowerCase()
          ) != -1
        )
      })
      .filter((v) => {
        if (this.state.onlineStatus === 'all') return true
        return this.state.onlineStatus === 'online' ? v.online : !v.online
      })
      .map((v) => {
        return (
          <RichCell
            key={`serverItem${v.id}`}
            after={
              v.online
                ? <span>онлайн</span>
                : <span style={{ color: 'var(--button_secondary_destructive_foreground)' }}>оффлайн</span>
            }
            caption={<div>ID: {v.id}</div>}
            onClick={() =>
              this.props.info.router.pushPage(URLS.SERVERS_SHOW, {
                id: v.id.toString()
              })
            }
          >
            {v.name}
          </RichCell>
        )
      })
    if (!servers || servers.length === 0) {
      return (
        <Placeholder>
          Сервера по этому поисковому запросу не найдены
        </Placeholder>
      )
    }
    return servers
  }

  render() {
    return (
      <BasePanel {...this.props} header="Сервера">
        <Group>
          <FormLayout>
            <FormItem top="Поиск">
              <Input
                type="search"
                value={this.state.searchString}
                onChange={(e) =>
                  this.setState({ searchString: e.currentTarget.value })
                }
              />
            </FormItem>
            <FormItem>
              <SegmentedControl
                onChange={(v) =>
                  this.setState({
                    onlineStatus: v as 'all' | 'online' | 'offline'
                  })
                }
                options={[
                  { label: 'Все', value: 'all' },
                  { label: 'Онлайн', value: 'online' },
                  { label: 'Оффлайн', value: 'offline' }
                ]}
              />
            </FormItem>
          </FormLayout>
          <Spacing separator size={16}/>
          <PullToRefresh
            onRefresh={() => this.onRefresh(true)}
            isFetching={this.state.isFetching}
          >
            {this.state.servers === null ? (
              <ServersSceleton/>
            ) : this.state.servers.length === 0 ? (
              <Placeholder>Вы еще не добавили сервер</Placeholder>
            ) : (
              this.renderServers()
            )}
          </PullToRefresh>
          <Spacing separator size={16}/>
          <Div>
            <Button
              mode={'secondary'}
              size={'l'}
              onClick={() => this.props.info.router.pushPage(URLS.SERVERS_NEW)}
              stretched
            >Добавить сервер</Button></Div>
        </Group>
      </BasePanel>
    )
  }
}
