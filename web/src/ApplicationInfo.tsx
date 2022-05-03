import React from 'react'

import { Location, Router } from '@happysanta/router'
import { Icon16DoneCircle, Icon16ErrorCircle, Icon16InfoCirle } from '@vkontakte/icons'
import { AppearanceType } from '@vkontakte/vk-bridge'
import { Avatar, Snackbar, ViewHeight, ViewWidth } from '@vkontakte/vkui'

import { GetSelfUserResponse } from './api'

interface IApplicationInfoProps {
  appearance: AppearanceType;
  currentUser: GetSelfUserResponse | null;
  viewHeight: ViewHeight;
  viewWidth: ViewWidth;
  router: Router;
  location: Location;
  snackbar: JSX.Element | null;

  setAppearance(appearance: AppearanceType): void;

  setSnackbar(snackbar: JSX.Element): void;

  setCurrentUser(user: GetSelfUserResponse): void;
}

export class ApplicationInfo {
  public appearance: AppearanceType
  public currentUser: GetSelfUserResponse | null
  public viewHeight: ViewHeight
  public viewWidth: ViewWidth
  public router: Router
  public location: Location
  public snackbar: JSX.Element | null

  private readonly _setAppearance: any
  private readonly _setSnackbar: any
  private readonly _setCurrentUser: any

  constructor(props: IApplicationInfoProps) {
    this.appearance = props.appearance
    this.currentUser = props.currentUser
    this.viewHeight = props.viewHeight
    this.viewWidth = props.viewWidth
    this.router = props.router
    this.location = props.location
    this.snackbar = props.snackbar

    this._setAppearance = props.setAppearance
    this._setSnackbar = props.setSnackbar
    this._setCurrentUser = props.setCurrentUser
  }

  get isMobile(): boolean {
    return this.viewWidth < ViewWidth.SMALL_TABLET
  }

  get isTablet(): boolean {
    return this.viewWidth < ViewWidth.DESKTOP && !this.isMobile
  }

  get isDesktop(): boolean {
    return !this.isTablet && !this.isMobile
  }

  public setAppearance(appearance: AppearanceType) {
    this._setAppearance(appearance)
  }

  public setSnackbar(snackbar: JSX.Element | null) {
    this._setSnackbar(snackbar)
  }

  public setCurrentUser(user: GetSelfUserResponse) {
    this._setCurrentUser(user)
  }

  public setDoneSnackbar(message: string) {
    this.setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => this.setSnackbar(null)}
        before={
          <Avatar size={16}>
            <Icon16DoneCircle fill="#0f0" width={14} height={14}/>
          </Avatar>
        }
      >
        {message}
      </Snackbar>
    )
  }

  public setNotificationSnackbar(message: string) {
    this.setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => this.setSnackbar(null)}
        before={
          <Avatar size={16}>
            <Icon16InfoCirle width={14} height={14}/>
          </Avatar>
        }
      >
        {message}
      </Snackbar>
    )
  }

  public setErrorSnackbar(message: string) {
    this.setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => this.setSnackbar(null)}
        before={
          <Avatar size={16}>
            <Icon16ErrorCircle fill="#f00" width={14} height={14}/>
          </Avatar>
        }
      >
        {message}
      </Snackbar>
    )
  }
}
