import React from 'react'

import { Card, InfoRow, SimpleCell, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'
import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { MemoryInfo } from '../../../../../api'
import { FORMAT_TIME, parseDataSize, rslice } from '../../../../../utils'

interface IMemoryMonitorProps {
  memoryInfo: MemoryInfo
  memoryInfoHistory: {memory: number, swap: number, date: Date}[]
}

export class MemoryMonitorSkeleton extends React.Component<any, any> {
  render() {
    return (
      <Card style={{padding: "10px 5px 20px 10px"}}>
        <Title level="1" style={{textAlign: 'center'}}>Память</Title>
        <div style={{width: "100%"}}>
          <Skeleton height="400px"/>
        </div>
        <SimpleCell disabled><InfoRow header="Memory"><Skeleton /></InfoRow></SimpleCell>
        <SimpleCell disabled><InfoRow header="Swap"><Skeleton /></InfoRow></SimpleCell>
      </Card>
    )
  }
}

export class MemoryMonitor extends React.Component<IMemoryMonitorProps, any> {
  render() {
    const clearDataMap = []
    const dataMap: any[] | undefined = []
    const dt = new Date()
    for (let i = 0; i < 21; i++) {
      clearDataMap.push({
        date: dt,
        memory: 0,
        swap: 0
      })
    }

    [...clearDataMap, ...this.props.memoryInfoHistory].map(v => {
      dataMap.push({
        name: FORMAT_TIME(v.date), // `${v.date.getHours()}:${v.date.getMinutes()}:${v.date.getSeconds()}`,
        memory: v.memory / 1000000000,
        swap: v.swap / 1000000000
      })
    })

    return (
      <Card style={{padding: "10px 5px 20px 10px"}}>
        <Title level="1" style={{textAlign: 'center'}}>Память</Title>
        <div style={{width: "100%"}}>
          <ResponsiveContainer height={400}>
            <AreaChart
              height={350}
              data={rslice(dataMap, 20)}
              margin={{
                top: 10,
                right: 40,
                left: 40,
                bottom: 70
              }}
            >
              <XAxis dataKey="name" fontSize={"small"} minTickGap={-200} angle={45} dx={15} dy={50} height={30}/>
              <YAxis fontSize={"small"} domain={[0, Math.floor(this.props.memoryInfo!.mem_total! / 1000000000) + 1]} dx={-30} >
                <Label value="Занято (gB)" color={'var(--text_primary)'} angle={-90} dx={-60} />
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3"/>
              <Area
                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: 'white'}}
                type="monotone"
                dataKey="memory"
                stroke="#8884d8"
                fill="#8884d8"
                unit="gB"
              />
              <Area
                dot={{ stroke: '#82ca9d', strokeWidth:2, r: 4, fill: 'white'}}
                type="monotone"
                dataKey="swap"
                stroke="#82ca9d"
                fill="#82ca9d"
                unit="gB"
              />
              <Legend verticalAlign="top" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <SimpleCell disabled><InfoRow header="Memory">{parseDataSize(this.props.memoryInfo.mem_total! - this.props.memoryInfo.mem_free!)}/{parseDataSize(this.props.memoryInfo.mem_total!)}</InfoRow></SimpleCell>
        <SimpleCell disabled><InfoRow header="Swap">{parseDataSize(this.props.memoryInfo.swap_total! - this.props.memoryInfo.swap_free!)}/{parseDataSize(this.props.memoryInfo.swap_total!)}</InfoRow></SimpleCell>
      </Card>
    )
  }
}
