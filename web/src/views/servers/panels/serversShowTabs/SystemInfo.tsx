import React from 'react'

import { InfoRow, SimpleCell } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { GetServerInfoResponse } from '../../../../api'
import { DateTimeDiff, FORMAT_DT } from '../../../../utils'

interface ISystemInfoTabTabProps {
  server_info: GetServerInfoResponse;
  tabActive: boolean;
}

interface ISystemInfoTabTabState {
  interval: any;
  diffLocal: string;
}

export class SystemInfoTabSkeleton extends React.Component<any, any> {
  render() {
    return (
      <>
        <SimpleCell disabled>
          <InfoRow header={'OS'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Uptime'}>
            <Skeleton/>
          </InfoRow>
        </SimpleCell>
      </>
    )
  }
}

export class SystemInfoTab extends React.Component<ISystemInfoTabTabProps,
  ISystemInfoTabTabState> {
  constructor(props: ISystemInfoTabTabProps) {
    super(props)
    this.state = {
      interval: null,
      diffLocal: ''
    }
  }

  componentDidMount() {
    const loc = new DateTimeDiff(
      new Date(),
      new Date(this.props.server_info.uptime)
    ).parse()
    this.setState({
      diffLocal: `${loc.days} дн. ${loc.hours} ч. ${loc.minutes} м. ${loc.seconds} с.`
    })
  }

  componentDidUpdate(
    prevProps: Readonly<ISystemInfoTabTabProps>,
    prevState: Readonly<ISystemInfoTabTabState>,
    snapshot?: any
  ) {
    if (this.props.tabActive && !this.state.interval) {
      this.setState({
        interval: setInterval(() => {
          const loc = new DateTimeDiff(
            new Date(),
            new Date(this.props.server_info.uptime)
          ).parse()
          this.setState({
            diffLocal: `${loc.days} дн. ${loc.hours} ч. ${loc.minutes} м. ${loc.seconds} с.`
          })
        }, 1000)
      })
    }
    if (!this.props.tabActive && this.state.interval) {
      clearInterval(this.state.interval)
      this.setState({ interval: null })
    }
  }

  render() {
    const v = this.props.server_info
    return (
      <>
        <SimpleCell disabled>
          <InfoRow header={'OS'}>
            {v.os_name} {v.os_release}
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header={'Uptime'}>
            {FORMAT_DT(v.uptime)} | {this.state.diffLocal}
          </InfoRow>
        </SimpleCell>
      </>
    )
  }
}
