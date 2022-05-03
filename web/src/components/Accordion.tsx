import React from 'react'

import { Card, SimpleCell } from '@vkontakte/vkui'
import { SimpleCellProps } from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell'

interface IAccordionProps {
  header: string
  headerProps: SimpleCellProps
}

interface IAccordionState {
  isOpen: boolean
}

class Accordion extends React.Component<React.PropsWithChildren<IAccordionProps>, IAccordionState> {
  constructor(props: IAccordionProps) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  render() {
    return (
      <div>
        <SimpleCell
          {...this.props.headerProps}
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          after={this.state.isOpen}
        >
          {this.props.header}
        </SimpleCell>
        {this.state.isOpen && <Card>{this.props.children}</Card>}
      </div>
    )
  }

}
