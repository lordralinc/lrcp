import { Page } from '@happysanta/router'

export class PageTree {
  items: PageTreeItem[]
  _allPages: Page[]

  constructor(items: PageTreeItem[]) {
    this.items = items
    this._allPages = []
    this.items.forEach((pageTreeItem) => {
      pageTreeItem.slaves.forEach((page: Page) => {
        this._allPages.push(page)
      })
    })
  }

  searchSlaveByViewAndPanel(viewId: string, panelId: string) {
    return this._allPages.filter((page) => {
      return page.panelId === panelId && page.viewId === viewId
    })[0]
  }

  searchMasterForSlave(slave: Page) {
    return this.items.filter((pageTreeItem) => {
      return pageTreeItem.slaves.indexOf(slave) !== -1
    })[0].master
  }
}

export class PageTreeItem {
  public master: Page
  public slaves: Page[]

  constructor(master: Page, slaves: Page[]) {
    this.master = master
    this.slaves = slaves
  }
}
