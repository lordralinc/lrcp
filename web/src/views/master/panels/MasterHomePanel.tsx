import React from 'react'

import { Group, InfoRow, SimpleCell } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'

import { GetMasterInfoResponse, MasterApi } from '../../../api'
import { BasePanel } from '../../../components'
import { IPanelProps } from '../../../types'
import { getApiConfig } from '../../../utils'

interface IMasterHomePanelState {
  master: GetMasterInfoResponse | null;
}

export class MasterHomePanel extends React.Component<IPanelProps,
  IMasterHomePanelState> {
  constructor(props: IPanelProps) {
    super(props)
    this.state = { master: null }
  }

  componentDidMount() {
    new MasterApi(getApiConfig())
      .getInfo()
      .then((response) => this.setState({ master: response.data }))
  }

  render() {
    return (
      <BasePanel {...this.props} header="Мастер">
        <Group>
          <SimpleCell disabled>
            <InfoRow header="IP">
              {this.state.master?.ip || <Skeleton/>}
            </InfoRow>
          </SimpleCell>
          <SimpleCell disabled>
            <InfoRow header="Порт">
              {this.state.master?.port || <Skeleton/>}
            </InfoRow>
          </SimpleCell>
        </Group>
      </BasePanel>
    )
  }
}
