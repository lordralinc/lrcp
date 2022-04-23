import React from 'react'

import { Page } from '@happysanta/router'
import { Icon28MoonOutline, Icon28SunOutline } from '@vkontakte/icons'
import { Button, Epic, Group, PanelHeader, Root, SimpleCell, SplitCol, Tabbar, TabbarItem } from '@vkontakte/vkui'

import { ApplicationInfo } from '../ApplicationInfo'
import { IS_SELECTED_TABS_TREE } from '../const'

export interface IMarkupTab {
  page: { url: string; page: Page };
  icon: React.ReactNode;
  label: string;
}

export interface ISideColProps {
  info: ApplicationInfo;
  tabs: IMarkupTab[];
}

export interface ICenterColProps {
  info: ApplicationInfo;
  tabs: IMarkupTab[];
  views: JSX.Element[];
}

class SideCol extends React.Component<ISideColProps, any> {
  render() {
    let content

    const isSelected = (
      currentViewId: string,
      currentPanelId: string,
      rootPage: Page
    ) => {
      return (
        IS_SELECTED_TABS_TREE.searchMasterForSlave(
          IS_SELECTED_TABS_TREE.searchSlaveByViewAndPanel(
            currentViewId,
            currentPanelId
          )
        ) === rootPage
      )
    }

    if (this.props.info.isDesktop) {
      content = this.props.tabs.map((tab: IMarkupTab, index: number) => {
        return (
          <SimpleCell
            key={`simpleSell${index}`}
            onClick={() => {
              this.props.info.router.pushPage(tab.page.url)
            }}
            before={tab.icon}
            className={
              isSelected(
                this.props.info.location.getViewId(),
                this.props.info.location.getPanelId(),
                tab.page.page
              )
                ? 'SideCol__selected'
                : undefined
            }
          >
            {tab.label}
          </SimpleCell>
        )
      })
      return (
        <>
          {this.props.info.isDesktop && <PanelHeader>LRCP</PanelHeader>}
          <Group>{content}</Group>
        </>
      )
    } else {
      content = this.props.tabs.map((tab, index) => (
        <TabbarItem
          key={`tabbarItem${index}`}
          onClick={() => {
            this.props.info.router.pushPage(tab.page.url)
          }}
          text={tab.label}
          selected={isSelected(
            this.props.info.location.getViewId(),
            this.props.info.location.getPanelId(),
            tab.page.page
          )}
        >
          {tab.icon}
        </TabbarItem>
      ))
      return (
        <>
          {this.props.info.isDesktop && <PanelHeader>LRCP</PanelHeader>}
          <Tabbar
            itemsLayout={this.props.info.isMobile ? 'vertical' : 'horizontal'}
          >
            {content}
          </Tabbar>
        </>
      )
    }
  }
}

export interface ILeftColProps {
  info: ApplicationInfo;
  tabs: any;
}

export class LeftCol extends React.Component<ILeftColProps, any> {
  constructor(props: ILeftColProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <SplitCol
        spaced={this.props.info.isDesktop || this.props.info.isTablet}
        fixed
        width="280px"
        maxWidth="280px"
      >
        {this.props.tabs.length !== 0 && (
          <SideCol info={this.props.info} tabs={this.props.tabs}/>
        )}
      </SplitCol>
    )
  }
}

export class CenterCol extends React.Component<ICenterColProps, any> {
  constructor(props: ICenterColProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <SplitCol
        spaced={!this.props.info.isMobile}
        animate={!this.props.info.isDesktop}
      >
        {this.props.info.isDesktop ? (
          <Root activeView={this.props.info.location.getViewId()}>
            {this.props.views}
          </Root>
        ) : (
          <Epic
            tabbar={
              this.props.tabs.length !== 0 && (
                <SideCol info={this.props.info} tabs={this.props.tabs}/>
              )
            }
            activeStory={this.props.info.location.getViewId()}
          >
            {this.props.views}
          </Epic>
        )}
      </SplitCol>
    )
  }
}

export interface IRightColProps {
  info: ApplicationInfo;
}

export class RightCol extends React.Component<IRightColProps, any> {
  render() {
    const nextScheme = this.props.info.appearance === 'dark' ? 'light' : 'dark'
    const avatar =
      this.props.info.appearance === 'dark' ? (
        <Icon28SunOutline/>
      ) : (
        <Icon28MoonOutline/>
      )

    return (
      <SplitCol
        spaced={this.props.info.isDesktop || this.props.info.isTablet}
        width="160px"
        maxWidth="160px"
      >
        {this.props.info.currentUser ? (
          <PanelHeader>
            {this.props.info.currentUser.full_name ||
              this.props.info.currentUser.username}
          </PanelHeader>
        ) : (
          <PanelHeader/>
        )}
        <Button
          mode="secondary"
          size="l"
          style={{ padding: '5px 5px 5px 5px' }}
          after={avatar}
          onClick={() => {
            this.props.info.setAppearance(nextScheme)
          }}
        />
      </SplitCol>
    )
  }
}
