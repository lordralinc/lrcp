import React from 'react'

import {
  Button,
  Card,
  CardGrid,
  CellButton,
  Div,
  FormItem,
  Group,
  InfoRow,
  Input,
  SimpleCell,
  Spacing
} from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'
import QRCode from "react-qr-code";

import { APIError, APIExceptionType, GetSelfUserResponse, UserApi } from '../../../api'
import { BasePanel } from '../../../components'
import { STORAGE_KEYS } from '../../../const'
import { IPanelProps } from '../../../types'
import { getApiConfig } from '../../../utils'

interface IHomeHonePanelState {
  code: string
  url: string
  twoFARenderState: "state" | "activate"
  twoFactorCode: number
}


export class HomeHomePanel extends React.Component<IPanelProps, IHomeHonePanelState> {

  constructor(props: IPanelProps) {
    super(props)
    this.state = {
      code: "",
      url: "",
      twoFARenderState: "state",
      twoFactorCode: 0
    }
  }

  delete2fa() {
    new UserApi(getApiConfig()).delete2FA()
      .then(r => {
        this.setState({twoFARenderState: 'state', url: '', code: ''})
        this.props.info.setCurrentUser(r.data)
      })
  }

  setupConnect() {
    new UserApi(getApiConfig()).get2FAData()
      .then(r => {
        this.setState({url: r.data.url, code: r.data.code})
      })
  }

  save2fa() {
    new UserApi(getApiConfig()).set2FA({code: this.state.twoFactorCode, totp_code: this.state.code})
      .then(r => {
        this.setState({twoFARenderState: 'state', url: '', code: '', twoFactorCode: 0})
        this.props.info.setCurrentUser(r.data)
      })
      .catch((reason) => {
        const errorData = reason.response.data as APIError;
        if (errorData.type === APIExceptionType.NeedTwoFactorCode) {
          this.props.info.setErrorSnackbar("Не верный код 2FA");
        }
      });
  }


  render() {

    const TwoFactor = (currentUser: GetSelfUserResponse | null) => {
      if (!currentUser) {
        return (
          <InfoRow header="2FA включен">
            <Skeleton count={1} />
          </InfoRow>
        )
      }

      if (this.state.twoFARenderState === 'activate') {
        return (
          <Div>
            <Spacing size={16} separator />
            <Div>Отсканируйте QR-код:</Div>
            <Div>
              <Card style={{textAlign: 'center', padding: "5px 5px 5px 5px"}}>
                {this.state.url ? <QRCode value={this.state.url} /> : <Skeleton height={256} width={256} />}
              </Card>
            </Div>
            <Div>Или введите этот код:</Div>
            <Div>
              {this.state.code ? <span>{this.state.code}</span> : <Skeleton />}
            </Div>
            <FormItem top="2FA">
              <Input
                type="number"
                name="twoFactorCode"
                value={this.state.twoFactorCode}
                onChange={(e) =>
                  this.setState({ twoFactorCode: parseInt(e.currentTarget.value) })
                }
                placeholder="Введите код 2FA"
              />
            </FormItem>
            <Div><Button onClick={() => this.save2fa()} disabled={!this.state.code ||  this.state.twoFactorCode > 0} size="l" stretched>Сохранить</Button></Div>
            <Spacing size={16} separator />
          </Div>
        )
      }

      if (currentUser.two_factor_enabled) {
        return (
          <SimpleCell after={<CellButton onClick={() => this.delete2fa()}>Отключить</CellButton>}><InfoRow header="2FA включен">Да</InfoRow></SimpleCell>
        )
      } else {
        return (
          <SimpleCell after={<CellButton onClick={() => {this.setState({twoFARenderState: 'activate'});this.setupConnect()}}>Подключить</CellButton>}><InfoRow header="2FA включен">Нет</InfoRow></SimpleCell>
        )
      }
    }


    return (
      <BasePanel {...this.props} header="Главная">
        <Group>
          <SimpleCell>
            <InfoRow header="Вы вошли как">
              {this.props.info.currentUser
                ? this.props.info.currentUser?.full_name || this.props.info.currentUser?.username
                : <Skeleton count={1} />}
            </InfoRow>
          </SimpleCell>
          {TwoFactor(this.props.info.currentUser)}
          <Div>
            <Button
              mode={'secondary'}
              appearance={'negative'}
              size={'l'}
              stretched
              onClick={() => {
                localStorage.removeItem(STORAGE_KEYS.TOKEN)
                document.location.reload()
              }}
            >
              Выйти
            </Button>
          </Div>
        </Group>
      </BasePanel>
    )
  }
}
