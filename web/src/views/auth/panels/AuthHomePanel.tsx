import React from 'react'

import { Button, Div, FormItem, FormLayout, FormStatus, Group, Input } from '@vkontakte/vkui'

import { APIError, APIExceptionType, AuthApi, UserApi } from '../../../api'
import { BasePanel } from '../../../components'
import { STORAGE_KEYS, URLS } from '../../../const'
import { IPanelProps } from '../../../types'
import { getApiConfig } from '../../../utils'

interface IAuthHomePanelState {
  login: string;
  password: string;
  twoFactorCode: number;
  statusHeader: string;
  statusBody: string;
  needTwoFactorCode: boolean;
}

interface ICheckResult {
  login: { result: boolean; reason: string };
  password: { result: boolean; reason: string };
  result: boolean;
}

export class AuthHomePanel extends React.Component<IPanelProps, IAuthHomePanelState> {
  constructor(props: IPanelProps) {
    super(props)
    this.state = {
      login: '',
      password: '',
      twoFactorCode: 0,
      statusHeader: '',
      statusBody: '',
      needTwoFactorCode: false
    }
    this.auth = this.auth.bind(this)
  }

  check(): ICheckResult {
    const data = {
      login: { result: true, reason: '' },
      password: { result: true, reason: '' }
    }

    if (!this.state.login)
      data.login = { result: false, reason: 'Пожалуйста, введите логин' }
    if (!this.state.password)
      data.password = { result: false, reason: 'Пожалуйста, введите пароль' }
    // if (this.state.password && (this.state.password?.length ?? 0) < 8) event.password = { result: false, reason: 'Пароль не может содержать меньше 8 символов' }

    return {
      ...data,
      result: data.login?.result && data.password?.result
    }
  }

  auth() {
    new AuthApi(getApiConfig())
      .getAccessToken(
        this.state.login!,
        this.state.password!,
        this.state.twoFactorCode
      )
      .then((result) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.access_token)
        new UserApi(getApiConfig()).getSelf().then((r) => {
          this.props.info.setCurrentUser(r.data)
          this.props.info.router.pushPage(URLS.HOME_HOME)
        })
      })
      .catch((reason) => {
        const errorData = reason.response.data as APIError
        if (errorData.type === APIExceptionType.InvalidCredit) {
          this.props.info.setErrorSnackbar('Не верный логин или пароль.')
          this.setState({
            statusHeader: 'Не верный логин или пароль.',
            statusBody:
              'Обратите внимание, что логин и пароль чувствительны к регистру.'
          })
        }
        if (errorData.type === APIExceptionType.InactiveUser) {
          this.props.info.setErrorSnackbar('Пользователь не активен')
          this.setState({
            statusHeader: 'Пользователь не активен.',
            statusBody: 'Обратитесь к администратору.'
          })
        }
        if (errorData.type === APIExceptionType.NeedTwoFactorCode) {
          this.props.info.setErrorSnackbar('Необходим код 2FA')
          this.setState({
            needTwoFactorCode: true,
            statusHeader: '',
            statusBody: ''
          })
        }
      })
  }

  render() {
    const checkResult = this.check()
    return (
      <BasePanel {...this.props} header="Авторизация">
        <Group>
          <FormLayout
            onSubmit={(e) => {
              e.preventDefault()
              this.auth()
            }}
          >
            {(this.state.statusHeader || this.state.statusBody) && (
              <FormItem>
                <FormStatus header={this.state.statusHeader} mode="error">
                  {this.state.statusBody}
                </FormStatus>
              </FormItem>
            )}
            <FormItem
              top="Логин"
              status={checkResult.login.result ? 'valid' : 'error'}
              bottom={checkResult.login.reason}
            >
              <Input
                type="text"
                name="login"
                placeholder="Введите логин"
                value={this.state.login}
                onChange={(e) =>
                  this.setState({ login: e.currentTarget.value })
                }
              />
            </FormItem>

            <FormItem
              top="Пароль"
              status={checkResult.password.result ? 'valid' : 'error'}
              bottom={checkResult.password.reason}
            >
              <Input
                type="password"
                name="password"
                value={this.state.password}
                onChange={(e) =>
                  this.setState({ password: e.currentTarget.value })
                }
                placeholder="Введите пароль"
              />
            </FormItem>

            {this.state.needTwoFactorCode && (
              <FormItem top="2FA">
                <Input
                  type="number"
                  name="twoFactorCode"
                  value={this.state.twoFactorCode}
                  onChange={(e) =>
                    this.setState({
                      twoFactorCode: parseInt(e.currentTarget.value)
                    })
                  }
                  placeholder="Введите код 2FA"
                />
              </FormItem>
            )}
          </FormLayout>
          <Div>
            <Button
              onClick={this.auth}
              size="l"
              disabled={!checkResult.result}
              stretched
            >
              Войти
            </Button>
          </Div>
        </Group>
      </BasePanel>
    )
  }
}
