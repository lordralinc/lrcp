import React from 'react'

import { Card, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'
import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { InfoNet } from '../../../../../sockets'
import { FORMAT_TIME, rslice, stringToColour } from '../../../../../utils'

interface INetMonitorProps {
  MetInfo: InfoNet
  NetInfoHistory:  { interfaces: { interfaceName: string, tx: number, rx: number }[], date: Date}[]
}

export class NetMonitorSkeleton extends React.Component<any, any> {
  render() {
    return (
      <Card style={{padding: "10px 5px 20px 10px"}}>
        <Title level="1" style={{textAlign: 'center'}}>Сеть</Title>
        <div style={{width: "100%"}}>
          <Skeleton height="400px"/>
        </div>
      </Card>
    )
  }
}

export class NetMonitor extends React.Component<INetMonitorProps, any> {

  render() {
    const clearDataMap = []
    for (let i = 21; i > 1; i--) {
      const dt = new Date()
      const _data = {
        interfaces: [] as any,
        date: dt
      } as any;
      this.props.MetInfo.interfaces.forEach(v => {
        _data.interfaces.push({
          interfaceName: v.name,
          tx: 0,
          rx: 0
        })
      })
      clearDataMap.push(_data)
    }


    const dataMap: any[] | undefined = []
    rslice([...clearDataMap, ...this.props.NetInfoHistory], 20).map(v => {
      const data = {
        name: FORMAT_TIME(v.date)
      } as any
      v.interfaces.forEach((cv: any) => {
        data[`${cv.interfaceName} RX`] = cv.rx * 8 / 1000000
        data[`${cv.interfaceName} TX`] = cv.tx * 8 / 1000000
      })
      dataMap.push(data)
    })

    return (
      <>
        <Card style={{padding: "10px 5px 20px 10px"}}>
          <Title level="1" style={{textAlign: 'center'}}>Сеть</Title>
          <div style={{width: "100%"}}>
            {dataMap && <ResponsiveContainer height={400}>
              <AreaChart
                height={350}
                data={rslice(dataMap, 20)}
                margin={{
                  top: 10,
                  right: 40,
                  left: 60,
                  bottom: 70
                }}
              >
                <XAxis dataKey="name" fontSize={"small"} minTickGap={-200} angle={45} dx={15} dy={50} height={30}/>
                <YAxis dx={-30}>
                  <Label value="Mbit/s" fontSize={"small"} color={'var(--text_primary)'} angle={-90} dx={-60} />
                </YAxis>

                <CartesianGrid stroke="#eee" strokeDasharray="3 3"/>
                {Object.keys(dataMap[0]).filter(v => {
                  return v !== 'name'
                }).map(v => {
                  return (
                    <Area
                      key={v}
                      isAnimationActive={false}
                      dot={{ stroke: stringToColour(v), strokeWidth: 2, r: 4, fill: 'white'}}
                      type="step"
                      dataKey={v}
                      stroke={stringToColour(v)}
                      fill={stringToColour(v, 0.3)}
                      unit="mB"
                    />
                  )
                })}
                <Legend verticalAlign="top" />
              </AreaChart>
            </ResponsiveContainer>}
          </div>
        </Card>
      </>
    )
  }
}
