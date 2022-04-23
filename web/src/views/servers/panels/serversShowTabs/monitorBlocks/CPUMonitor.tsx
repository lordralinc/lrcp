import React from 'react'

import { Card, Title } from '@vkontakte/vkui'
import Skeleton from 'react-loading-skeleton'
import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { InfoCPU } from '../../../../../sockets'
import { FORMAT_TIME, rslice, stringToColour } from '../../../../../utils'

interface ICPUMonitorProps {
  CPUInfo: InfoCPU
  CPUInfoHistory: { cores: { cpu: string, load: number }[], date: Date}[]
}

export class CPUMonitorSkeleton extends React.Component<any, any> {
  render() {
    return (
      <Card style={{padding: "10px 5px 20px 10px"}}>
        <Title level="1" style={{textAlign: 'center'}}>CPU</Title>
        <div style={{width: "100%"}}>
          <Skeleton height="400px"/>
        </div>
      </Card>
    )
  }
}

export class CPUMonitor extends React.Component<ICPUMonitorProps, any> {

  getClearData() {
    const clearDataMap = []
    const dt = new Date()
    for (let i = 21; i > 1; i--) {
      const data = {
        cores: [{cpu:  "Общая загрузка", load: 0}],
        date: dt
      }
      this.props.CPUInfo.cores.forEach(v => {
        data.cores.push({
          cpu: `[${v.core_id}] ${v.model_name}`,
          load: 0
        })
      })
      clearDataMap.push(data)
    }
    return clearDataMap;
  }

  render() {
    const dataMap: any[] | undefined = []
    rslice([...this.getClearData(), ...this.props.CPUInfoHistory], 20).map(v => {
      const data = { name: FORMAT_TIME(v.date) } as any;
      v.cores.forEach((cv: any) => { data[cv.cpu] = cv.load * 100 })
      dataMap.push(data)
    })

    return (
      <>
        <Card style={{padding: "10px 5px 20px 10px"}}>
          <Title level="1" style={{textAlign: 'center'}}>CPU</Title>
          <div style={{width: "100%"}}>
            {dataMap && dataMap[0] && <ResponsiveContainer height={400}>
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
                <YAxis fontSize={"small"} tickCount={11} domain={[0, 100]} dx={-30}>
                  <Label value="Загрузка (%)" color={'var(--text_primary)'} angle={-90} dx={-60} />
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
                      unit="%"
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
