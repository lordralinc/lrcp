import { Configuration } from './api'
import { API_DOMAIN, STORAGE_KEYS } from './const'

export function getApiConfig(): Configuration {
  return new Configuration({
    basePath: API_DOMAIN,
    accessToken: localStorage.getItem(STORAGE_KEYS.TOKEN) || undefined
  })
}

export const DT_FORMAT_LOCALE = 'ru-RU'
export const DT_FORMAT_OPTIONS = {
  year: 'numeric' as 'numeric' | '2-digit' | undefined,
  month: 'numeric' as 'numeric' | '2-digit' | undefined,
  day: 'numeric' as 'numeric' | '2-digit' | undefined,
  hour: 'numeric' as 'numeric' | '2-digit' | undefined,
  minute: 'numeric' as 'numeric' | '2-digit' | undefined,
  hour12: false
}
export const TIME_FORMAT_OPTIONS = {
  hour: '2-digit' as 'numeric' | '2-digit' | undefined,
  minute: '2-digit' as 'numeric' | '2-digit' | undefined,
  second: '2-digit' as 'numeric' | '2-digit' | undefined,
  hour12: false
}
export const CREATE_DT = (dt_str: string) => new Date(dt_str)
export const FORMAT_DT = (dt_str: string) => {
  return new Intl.DateTimeFormat(DT_FORMAT_LOCALE, DT_FORMAT_OPTIONS).format(
    CREATE_DT(dt_str)
  )
}
export const FORMAT_TIME = (dt: Date) => {
  return new Intl.DateTimeFormat(DT_FORMAT_LOCALE, TIME_FORMAT_OPTIONS).format(
    dt
  )
}
export const FORMAT_DT_DATE = (dt: Date) =>
  new Intl.DateTimeFormat(DT_FORMAT_LOCALE, DT_FORMAT_OPTIONS).format(dt)

interface IDateTimeDiffResult {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

export class DateTimeDiff {
  private d1: Date
  private d2: Date

  private _MINUTES = 60
  private _HOURS = this._MINUTES * 60
  private _DAYS = this._HOURS * 24

  constructor(d1: Date, d2: Date) {
    this.d1 = d1
    this.d2 = d2
  }

  get diffSeconds(): number {
    return Math.round((this.d1.getTime() - this.d2.getTime()) / 1000)
  }

  parse(): IDateTimeDiffResult {
    const data = {
      totalSeconds: this.diffSeconds,
      totalMinutes: 0,
      totalHours: 0,

      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0
    }
    let total = data.totalSeconds
    data.totalSeconds = total
    data.totalMinutes = Math.floor(total / this._MINUTES)
    data.totalHours = Math.floor(total / this._HOURS)

    data.days = Math.floor(total / this._DAYS)
    total -= data.days * this._DAYS
    data.hours = Math.floor(total / this._HOURS)
    total -= data.hours * this._HOURS
    data.minutes = Math.floor(total / this._MINUTES)
    total -= data.minutes * this._MINUTES
    data.seconds = Math.round(total)
    return data
  }
}

export function parseDataSize(n?: number) {
  if (!n) return '0 B'

  if (n >= 1000000000) return `${(n / 1000000000).toFixed(2)} gB`
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)} mB`
  if (n >= 1000) return `${(n / 1000).toFixed(2)} kB`
  return `${n} B`
}

export function rslice(list: Array<any>, len: number) {
  if (list.length <= len) return list
  return list.slice(list.length - len, list.length)
}


export const stringToColour = (str: string, op: number = 1) => {
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  const hashed = hexToRgb(colour)
  return `rgba(${hashed?.r}, ${hashed?.g}, ${hashed?.b}, ${op})`
}


export const bitToGOST8417 = (value: number) => {
  const dataset = [
    { pow: 24, name: 'Йбит' },
    { pow: 21, name: 'Збит' },
    { pow: 18, name: 'Эбит' },
    { pow: 15, name: 'Пбит' },
    { pow: 12, name: 'Тбит' },
    { pow: 9, name: 'Гбит' },
    { pow: 6, name: 'Мбит' },
    { pow: 3, name: 'Kбит' }
  ]
  for (const datasetKey of dataset) {
    if (value / Math.pow(10, datasetKey.pow) >= 1) {
      return `${(value / Math.pow(10, datasetKey.pow)).toFixed(2)} ${datasetKey.name}`
    }
  }
  return `${value.toFixed(2)} бит`
}


export const byteToGOST8417 = (value: number) => {
  const dataset = [
    { pow: 24, name: 'Йбайт' },
    { pow: 21, name: 'Збайт' },
    { pow: 18, name: 'Эбайт' },
    { pow: 15, name: 'Пбайт' },
    { pow: 12, name: 'Тбайт' },
    { pow: 9, name: 'Гбайт' },
    { pow: 6, name: 'Мбайт' },
    { pow: 3, name: 'Kбайт' }
  ]
  for (const datasetKey of dataset) {
    if (value / Math.pow(10, datasetKey.pow) >= 1) {
      return `${(value / Math.pow(10, datasetKey.pow)).toFixed(2)} ${datasetKey.name}`
    }
  }
  return `${value.toFixed(2)} байт`
}

export const bitToMEC = (value: number) => {
  const dataset = [
    { pow: 80, name: 'Йибит' },
    { pow: 70, name: 'Зибит' },
    { pow: 60, name: 'Эибит' },
    { pow: 50, name: 'Пибит' },
    { pow: 40, name: 'Тибит' },
    { pow: 30, name: 'Гибит' },
    { pow: 20, name: 'Мибит' },
    { pow: 10, name: 'Kибит' }
  ]
  for (const datasetKey of dataset) {
    if (value / Math.pow(2, datasetKey.pow) >= 1) {
      return `${(value / Math.pow(2, datasetKey.pow)).toFixed(2)} ${datasetKey.name}`
    }
  }
  return `${value.toFixed(2)} бит`
}


export const byteToMEC = (value: number) => {
  const dataset = [
    { pow: 80, name: 'ЙиБ' },
    { pow: 70, name: 'ЗиБ' },
    { pow: 60, name: 'ЭиБ' },
    { pow: 50, name: 'ПиБ' },
    { pow: 40, name: 'ТиБ' },
    { pow: 30, name: 'ГиБ' },
    { pow: 20, name: 'МиБ' },
    { pow: 10, name: 'KиБ' }
  ]
  for (const datasetKey of dataset) {
    if (value / Math.pow(2, datasetKey.pow) >= 1) {
      return `${(value / Math.pow(2, datasetKey.pow)).toFixed(2)} ${datasetKey.name}`
    }
  }
  return `${value.toFixed(2)} байт`
}


export const toFixed = (s: number): string => {
  if (s.toString().length == 2) {
    return s.toString()
  }
  return `0${s}`
}
