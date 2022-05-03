import { Page, Router } from '@happysanta/router'

import { PageTree, PageTreeItem } from './features'


export const DEBUG = import.meta.env.DEV
export const API_DOMAIN = import.meta.env.VITE_API_URL

export const STORAGE_KEYS = {
  TOKEN: 'LRCP_ACCESS_TOKEN',
  THEME: 'LRCP_THEME'
}

export const VIEWS_IDS = {
  HOME: 'home',
  MASTER: 'master',
  SERVERS: 'servers',
  SETTINGS: 'settings',
  AUTH: 'auth'
}
export const PANEL_IDS = {
  HOME_HOME: 'home',
  MASTER_HOME: 'home',
  SERVERS_HOME: 'home',
  SERVERS_NEW: 'new',
  SERVERS_SHOW: 'show',
  SETTINGS_HOME: 'home',
  AUTH_HOME: 'home'
}
export const URLS = {
  HOME_HOME: '/',
  MASTER_HOME: '/master',
  SERVERS_HOME: '/servers',
  SERVERS_NEW: `/servers/new`,
  SERVERS_SHOW: `/servers/:id([0-9]+)`,
  SETTINGS_HOME: '/settings',
  AUTH_HOME: '/auth'
}
export const PAGES = {
  HOME_HOME: new Page(PANEL_IDS.HOME_HOME, VIEWS_IDS.HOME, URLS.HOME_HOME),
  MASTER_HOME: new Page(
    PANEL_IDS.MASTER_HOME,
    VIEWS_IDS.MASTER,
    URLS.MASTER_HOME
  ),
  SERVERS_HOME: new Page(
    PANEL_IDS.SERVERS_HOME,
    VIEWS_IDS.SERVERS,
    URLS.SERVERS_HOME
  ),
  SERVERS_NEW: new Page(
    PANEL_IDS.SERVERS_NEW,
    VIEWS_IDS.SERVERS,
    URLS.SERVERS_NEW
  ),
  SERVERS_SHOW: new Page(
    PANEL_IDS.SERVERS_SHOW,
    VIEWS_IDS.SERVERS,
    URLS.SERVERS_SHOW
  ),
  SETTINGS_HOME: new Page(
    PANEL_IDS.SETTINGS_HOME,
    VIEWS_IDS.SETTINGS,
    URLS.SETTINGS_HOME
  ),
  AUTH_HOME: new Page(PANEL_IDS.AUTH_HOME, VIEWS_IDS.AUTH, URLS.AUTH_HOME)
}

export const POPUP_IDS = {
  SCREEN_LOADING: 'sl'
}

export const IS_SELECTED_TABS_TREE = new PageTree([
  new PageTreeItem(PAGES.HOME_HOME, [PAGES.HOME_HOME, PAGES.AUTH_HOME]),
  new PageTreeItem(PAGES.MASTER_HOME, [PAGES.MASTER_HOME]),
  new PageTreeItem(PAGES.SERVERS_HOME, [
    PAGES.SERVERS_HOME,
    PAGES.SERVERS_NEW,
    PAGES.SERVERS_SHOW
  ]),
  new PageTreeItem(PAGES.SETTINGS_HOME, [PAGES.SETTINGS_HOME])
])

export const ROUTES = {
  [URLS.HOME_HOME]: PAGES.HOME_HOME,
  [URLS.MASTER_HOME]: PAGES.MASTER_HOME,
  [URLS.SERVERS_HOME]: PAGES.SERVERS_HOME,
  [URLS.SERVERS_NEW]: PAGES.SERVERS_NEW,
  [URLS.SERVERS_SHOW]: PAGES.SERVERS_SHOW,
  [URLS.SETTINGS_HOME]: PAGES.SETTINGS_HOME,
  [URLS.AUTH_HOME]: PAGES.AUTH_HOME
}
export const ROUTER = new Router(ROUTES, {
  enableLogging: DEBUG,
  defaultView: VIEWS_IDS.HOME,
  defaultPanel: PANEL_IDS.HOME_HOME
})
