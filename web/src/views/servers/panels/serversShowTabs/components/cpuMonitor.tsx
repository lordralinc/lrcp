import React from 'react'

import { Placeholder } from '@vkontakte/vkui'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { FORMAT_TIME, stringToColour } from '../../../../../utils'


export interface ICpuMonitorProps {
  data: { date: Date, cores: { name: string, load: number }[] }[]
  dateFormatter?: (dt: Date) => string
  height?: number
}


export interface ICpuMonitorState {
  isLoading: boolean
}

export class CpuMonitor extends React.Component<ICpuMonitorProps, ICpuMonitorState> {
  private readonly dateFormatter: (dt: Date) => string
  private readonly height: number

  constructor(props: ICpuMonitorProps) {
    super(props)
    this.state = {
      isLoading: true
    }
    this.dateFormatter = props.dateFormatter || FORMAT_TIME
    this.height = props.height || 400
  }

  getDataMap(): { [key: string]: any }[] {
    return this.props.data.map(record => {
      const data = { date: this.dateFormatter(record.date) } as any
      record.cores.forEach(core => {
        data[core.name] = core.load > 1 ? core.load : core.load * 100
      })
      return data
    })
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
            formatter={(value: any, name: any, props: any) => [value.toFixed(2), name !== 'all' ? name : 'Общее']}
          />
          <XAxis dataKey="date" fontSize={'small'} minTickGap={-200} angle={45} dx={15} dy={50} height={30}/>
          <YAxis fontSize={'small'} tickCount={11} domain={[0, 100]} dx={-30}/>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3"/>
          {data && Object.keys(data[0]).filter(v => v !== 'date').map(v => {
            return (
              <Area
                key={v !== 'all' ? v : 'Общее'}
                isAnimationActive={false}
                dot={{ stroke: stringToColour(v), strokeWidth: 2, r: 4, fill: 'white' }}
                type="step"
                dataKey={v}
                stroke={stringToColour(v)}
                fill={stringToColour(v, 0.3)}
                unit="%"
              />
            )
          })}
          <Legend verticalAlign="top"/>
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}
