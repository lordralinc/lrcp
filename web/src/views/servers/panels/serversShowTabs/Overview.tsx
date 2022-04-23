import React from 'react'

import { Button, Div, InfoRow, SimpleCell } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { GetServerResponse, ServersApi } from '../../../../api'
import { ApplicationInfo } from '../../../../ApplicationInfo'
import { URLS } from '../../../../const'
import { FORMAT_DT, getApiConfig } from '../../../../utils'

interface IOverviewTabProps {
  server: GetServerResponse;
  info: ApplicationInfo;
}

export class OverviewTabSkeleton extends React.Component<any, any> {
  render() {
    return (
      <>
        <SimpleCell disabled>
          <InfoRow header={'ID'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Имя'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'IP'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'gRPC порт'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Дата добавления'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Состояние'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
      </>
    )
  }
}

export class OverviewTab extends React.Component<IOverviewTabProps, any> {
  delete() {
    new ServersApi(getApiConfig())
      .deleteServer(this.props.server.id)
      .then(() => {
        this.props.info.router.pushPage(URLS.SERVERS_HOME)
      })
  }

  render() {
    const { server } = this.props
    return (
      <>
        <SimpleCell disabled>
          <InfoRow header={'ID'}>{server.id}</InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Имя'}>{server.name}</InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'IP'}>{server.ip_address}</InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'gRPC порт'}>{server.grpc_port}</InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Дата добавления'}>
            {FORMAT_DT(server.connect_time)}
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Состояние'}>
            {server.online ? (
              <span>онлайн</span>
            ) : (
              <span
                style={{
                  color: 'var(--button_secondary_destructive_foreground)'
                }}
              >
                оффлайн
              </span>
            )}
          </InfoRow>
        </SimpleCell>
        <Div>
          <Button
            mode="outline"
            appearance="negative"
            size="l"
            onClick={() => this.delete()}
            stretched
          >
            Удалить
          </Button>
        </Div>
      </>
    )
  }
}
