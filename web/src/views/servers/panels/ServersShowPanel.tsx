import React from 'react'

import { RouterParams, withParams } from '@happysanta/router'
import { Group, Placeholder, Tabs, TabsItem } from '@vkontakte/vkui'

import { GetServerInfoResponse, GetServerMonitorWSResponse, GetServerResponse, ServersApi } from '../../../api'
import { BasePanel } from '../../../components'
import { IPanelProps } from '../../../types'
import { getApiConfig } from '../../../utils'
import { MonitorTab, OverviewTab, OverviewTabSkeleton, SystemInfoTab, SystemInfoTabSkeleton } from './serversShowTabs'

interface IServersShowPanelProps extends IPanelProps, RouterParams {
}

interface IServersShowPanelState {
  server: GetServerResponse | null;
  server_info: GetServerInfoResponse | null;
  activeTab: string;
}

class ServersShowPanelToHOC extends React.Component<IServersShowPanelProps,
  IServersShowPanelState> {
  private tabs: { id: string; label: string }[]

  constructor(props: IServersShowPanelProps) {
    super(props)
    this.state = {
      server: null,
      server_info: null,
      activeTab: 'overview'
    }
    this.tabs = [
      { id: 'overview', label: 'Просмотр' },
      { id: 'system_info', label: 'Системная информация' },
      { id: 'statistics', label: 'Статистика  ' },
      { id: 'monitor', label: 'Монитор' }
    ]
  }

  componentDidMount() {
    new ServersApi(getApiConfig())
      .getServer(parseInt(this.props.params.id))
      .then((r) => this.setState({ server: r.data }))
  }

  componentDidUpdate(
    prevProps: Readonly<IServersShowPanelProps>,
    prevState: Readonly<IServersShowPanelState>,
    snapshot?: any
  ) {
    if (!this.state.server_info && this.state.activeTab === 'system_info') {
      new ServersApi(getApiConfig())
        .getServerInfo(parseInt(this.props.params.id))
        .then((r) => {
          this.setState({ server_info: r.data })
        })
    }
  }

  renderTabs() {
    return (
      <>
        {this.state.activeTab === 'system_info' &&
          (this.state.server_info ? (
            <SystemInfoTab
              server_info={this.state.server_info!}
              tabActive={this.state.activeTab === 'system_info'}
            />
          ) : (
            <SystemInfoTabSkeleton/>
          ))}
        {this.state.activeTab === 'monitor' && (
          this.state.server
            ? <MonitorTab
                server={this.state.server!}
                info={this.props.info}
                tabActive={this.state.activeTab === 'monitor'}
              />
            : null
        )
        }
      </>
    )
  }

  render() {
    return (
      <BasePanel {...this.props} header="Просмотр сервера" needBack>
        <Group>
          <Tabs>
            {this.tabs.map((v) => {
              return (
                <TabsItem
                  key={`tabItemKey${v.id}`}
                  onClick={() => {
                    this.setState({ activeTab: v.id })
                  }}
                  selected={this.state.activeTab === v.id}
                >
                  {v.label}
                </TabsItem>
              )
            })}
          </Tabs>
          {this.state.activeTab === 'overview' ? (
            this.state.server ? (
              <OverviewTab info={this.props.info} server={this.state.server!}/>
            ) : (
              <OverviewTabSkeleton/>
            )
          ) : this.state.server != null ? (
            this.state.server.online ? (
              this.renderTabs()
            ) : (
              <Placeholder>Сервер оффлайн</Placeholder>
            )
          ) : (
            this.renderTabs()
          )}
        </Group>
      </BasePanel>
    )
  }
}

export const ServersShowPanel = withParams(ServersShowPanelToHOC)
