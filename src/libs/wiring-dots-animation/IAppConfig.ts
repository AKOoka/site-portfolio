import { IRgb, Rgba } from './Rgba'

export interface IAppConfig {
  circleCount: number
  circleColor: Rgba
  circleConnectionMaxDistance: number
  circleConnectionColor: Rgba
}

export interface IAppUserConfig {
  circleCount?: number
  circleColor?: IRgb
  circleConnectionMaxDistance?: number
  circleConnectionColor?: IRgb
}
