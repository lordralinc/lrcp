import '@vkontakte/vkui/dist/vkui.css'
import './css/index.css'
import 'react-loading-skeleton/dist/skeleton.css'

import React from 'react'

import { RouterProps, withRouter } from '@happysanta/router'
import {
  Icon16InfoCirle,
  Icon24GearOutline,
  Icon28FavoriteOutline,
  Icon28GridLayoutOutline,
  Icon28HomeOutline
} from '@vkontakte/icons'
import { AppearanceType } from '@vkontakte/vk-bridge'
import {
  Avatar,
  ModalRoot,
  PanelHeader,
  ScreenSpinner,
  Snackbar,
  SplitLayout,
  ViewHeight,
  ViewWidth,
  VKCOM,
  withAdaptivity,
  withPlatform
} from '@vkontakte/vkui'
import { AdaptivityProps } from '@vkontakte/vkui/src/components/AdaptivityProvider/AdaptivityContext'
import { SkeletonTheme } from 'react-loading-skeleton'

import { GetSelfUserResponse, UserApi } from './api'
import { ApplicationInfo } from './ApplicationInfo'
import { CenterCol, IMarkupTab, LeftCol, RightCol } from './components'
import { PAGES, POPUP_IDS, ROUTER, URLS, VIEWS_IDS } from './const'
import { getApiConfig } from './utils'
import { AuthView, HomeView, MasterView, ServersView, SettingsView } from './views'

interface IBaseApplicationProps extends RouterProps, AdaptivityProps {
  platform: string;
  appearance: AppearanceType;

  setAppearance(appearance: AppearanceType): void;
}

interface IBaseApplicationState {
  currentUser: GetSelfUserResponse | null;
  snackbar: JSX.Element | null;
}

class BaseApplication extends React.Component<IBaseApplicationProps,
  IBaseApplicationState> {
  constructor(props: IBaseApplicationProps) {
    super(props)
    this.state = {
      currentUser: null,
      snackbar: null
    }
  }

  componentDidMount() {
    let currentUser: GetSelfUserResponse | null
    let redirectToAuth = false

    new UserApi(getApiConfig())
      .getSelf()
      .then((response) => {
        currentUser = response.data
      })
      .catch(() => {
        redirectToAuth = true
        currentUser = null
        this.setState({
          snackbar: (
            <Snackbar
              layout="vertical"
              onClose={() => this.setState({ snackbar: null })}
              before={
                <Avatar size={16}>
                  <Icon16InfoCirle width={14} height={14}/>
                </Avatar>
              }
            >
              Вы будете перенаправлены на страницу авторизации
            </Snackbar>
          )
        })
      })
      .finally(() => {
        this.setState({ currentUser })
        if (redirectToAuth) this.props.router.replacePage(URLS.AUTH_HOME)
      })
  }

  getModals(appInfo: ApplicationInfo): JSX.Element {
    return <ModalRoot activeModal={appInfo.location.getModalId()}></ModalRoot>
  }

  getTabs(appInfo: ApplicationInfo): IMarkupTab[] {
    if (!appInfo.currentUser) return []
    return [
      {
        page: { url: URLS.HOME_HOME, page: PAGES.HOME_HOME },
        icon: <Icon28HomeOutline/>,
        label: 'Главная'
      },
      {
        page: { url: URLS.MASTER_HOME, page: PAGES.MASTER_HOME },
        icon: <Icon28FavoriteOutline/>,
        label: 'Мастер'
      },
      {
        page: { url: URLS.SERVERS_HOME, page: PAGES.SERVERS_HOME },
        icon: <Icon28GridLayoutOutline/>,
        label: 'Сервера'
      },
      {
        page: { url: URLS.SETTINGS_HOME, page: PAGES.SETTINGS_HOME },
        icon: <Icon24GearOutline height={28} width={28}/>,
        label: 'Настройки'
      }
    ]
  }

  getViews(appInfo: ApplicationInfo): JSX.Element[] {
    return [
      <HomeView id={VIEWS_IDS.HOME} info={appInfo} key="homeView"/>,
      <AuthView id={VIEWS_IDS.AUTH} info={appInfo} key="authView"/>,
      <SettingsView
        id={VIEWS_IDS.SETTINGS}
        info={appInfo}
        key="settingsView"
      />,
      <MasterView id={VIEWS_IDS.MASTER} info={appInfo} key="masterView"/>,
      <ServersView id={VIEWS_IDS.SERVERS} info={appInfo} key="serversView"/>
    ]
  }

  resolvePopout(popoutID: string | null): React.ReactNode | null {
    if (popoutID === POPUP_IDS.SCREEN_LOADING) return <ScreenSpinner/>
    return null
  }

  render() {
    const applicationInfo = new ApplicationInfo({
      appearance: this.props.appearance,
      setAppearance: this.props.setAppearance,
      setSnackbar: (snackbar) => this.setState({ snackbar }),
      setCurrentUser: (user) => this.setState({ currentUser: user }),
      currentUser: this.state.currentUser,
      viewWidth: this.props.viewWidth || ViewWidth.DESKTOP,
      viewHeight: this.props.viewHeight || ViewHeight.MEDIUM,
      router: ROUTER,
      location: this.props.location,
      snackbar: this.state.snackbar
    })

    const htmlBaseColorDiv = document.getElementById('sceletonBaseColor')
    const htmlHighlightColorDiv = document.getElementById('sceletonHighColor')

    return (
      <SkeletonTheme
        baseColor={htmlBaseColorDiv?.style.color}
        highlightColor={htmlHighlightColorDiv?.style.color}
      >
        <SplitLayout
          popout={this.resolvePopout(applicationInfo.location.getPopupId())}
          style={{ justifyContent: 'center' }}
          header={
            this.props.platform !== VKCOM && <PanelHeader separator={false}/>
          }
          modal={this.getModals(applicationInfo)}
        >
          {applicationInfo.isDesktop && (
            <LeftCol
              info={applicationInfo}
              tabs={this.getTabs(applicationInfo)}
            />
          )}
          <CenterCol
            info={applicationInfo}
            tabs={this.getTabs(applicationInfo)}
            views={this.getViews(applicationInfo)}
          />
          {applicationInfo.isDesktop && <RightCol info={applicationInfo}/>}
        </SplitLayout>
      </SkeletonTheme>
    )
  }
}

export default withRouter(
  withAdaptivity(withPlatform(BaseApplication), {
    viewWidth: true,
    viewHeight: true
  })
)
