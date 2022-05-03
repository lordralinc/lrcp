import React from 'react'

import { Placeholder } from '@vkontakte/vkui'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { bitToGOST8417, byteToGOST8417, FORMAT_TIME, stringToColour } from '../../../../../utils'


export interface INetMonitorProps {
  data: { interfaces: { name: string, tx: number, rx: number }[], date: Date }[]
  dateFormatter?: (dt: Date) => string
  height?: number
}

export interface INetMonitorState {
  domainState?: number,
  isLoading: boolean
}


export class NetMonitor extends React.Component<INetMonitorProps, INetMonitorState> {
  private readonly dateFormatter: (dt: Date) => string
  private readonly height: number

  constructor(props: INetMonitorProps) {
    super(props)

    this.state = {
      domainState: undefined,
      isLoading: true
    }
    this.nextDomain = this.nextDomain.bind(this)

    this.dateFormatter = props.dateFormatter || FORMAT_TIME
    this.height = props.height || 400
  }

  getDomain() {
    if (!this.state.domainState) {
      return undefined
    }
    return [0, this.state.domainState]
  }

  nextDomain() {
    let domain = undefined
    if (!this.state.domainState) {
      domain = 100000000
    } else if (this.state.domainState === 100000000) {
      domain = 200000000
    } else if (this.state.domainState === 200000000) {
      domain = 200000000000
    } else if (this.state.domainState === 200000000000) {
      domain = undefined
    }
    this.setState({ domainState: domain })
  }

  getDataMap(): { [key: string]: any }[] {
    return this.props.data.map(record => {
      const data = { date: this.dateFormatter(record.date) } as any
      record.interfaces.forEach((interfaceData) => {
        data[interfaceData.name + '_rx'] = interfaceData.rx === 0 ? null : interfaceData.rx
        data[interfaceData.name + '_tx'] = interfaceData.tx === 0 ? null : interfaceData.tx
      })
      return data
    })
  }

  netTickFormatter(value: any, index: number): string {
    return bitToGOST8417(value)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 10000)
  }

  render() {
    const data = this.getDataMap()
    if (data.length <= 1 && this.state.isLoading) {
      return <Placeholder>Идет загрузка</Placeholder>
    } else if (data.length === 0 && !this.state.isLoading) {
      return <Placeholder>Нет данных</Placeholder>
    }
    return (
      <ResponsiveContainer height={this.height}>
        <AreaChart
          height={this.height - 50}
          data={data}
          margin={{
            top: 10,
            right: 40,
            left: 40,
            bottom: 70
          }}
        >
          <Tooltip
            formatter={(value: any, name: any, props: any) => [`${bitToGOST8417(value)}/c. = ${byteToGOST8417(value / 8)}/c.`, name]}
          />
          <XAxis dataKey="date" fontSize={'small'} minTickGap={-200} angle={45} dx={15} dy={50} height={30}/>
          <YAxis onClick={this.nextDomain} dx={-30} domain={this.getDomain()} tickFormatter={this.netTickFormatter}/>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3"/>
          {data && Object.keys(data[0]).filter(v => v !== 'date').map(v => {
            return (
              <Area
                key={v}
                isAnimationActive={false}
                dot={{ stroke: stringToColour(v), strokeWidth: 2, r: 4, fill: 'white' }}
                type="step"
                dataKey={v}
                stroke={stringToColour(v)}
                fill={stringToColour(v, 0.3)}
              />
            )
          })}
          <Legend verticalAlign="top"/>
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}
