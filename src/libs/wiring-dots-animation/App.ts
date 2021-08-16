import { Boundaries } from './Boundaries'
import { IAppUserConfig, IAppConfig } from './IAppConfig'
import { Renderer } from './Renderer'
import { Rgba } from './Rgba'
import { Scene } from './Scene'
import { SceneUpdateSystem } from './SceneUpdateSystem'

export class App {
  private readonly _canvas: HTMLCanvasElement
  private readonly _ctx: CanvasRenderingContext2D
  private readonly _config: IAppConfig
  private _boundaries: Boundaries
  private readonly _scene: Scene
  private _sceneUpdateSystem!: SceneUpdateSystem
  private _renderer!: Renderer
  private _isPaused: boolean

  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, config?: IAppUserConfig) {
    this._canvas = canvas
    this._ctx = ctx
    this._isPaused = true
    this._boundaries = Boundaries.GenerateFromCanvas(canvas)
    this._scene = new Scene()

    if (config !== undefined) {
      this._config = this._generateAppConfig(config)
    } else {
      this._config = this._generateAppConfig({})
    }
  }

  private _generateAppConfig (config: IAppUserConfig): IAppConfig {
    const circleCount: number = config.circleCount ?? 0
    const circleConnectionMaxDistance: number = config.circleConnectionMaxDistance ?? 200
    let circleColor: Rgba
    let circleConnectionColor: Rgba

    if (config.circleColor === undefined) {
      circleColor = Rgba.CreateDefault()
    } else {
      const { r, g, b } = config.circleColor
      circleColor = new Rgba(r, g, b, 1)
    }

    if (config.circleConnectionColor === undefined) {
      circleConnectionColor = Rgba.CreateDefault()
    } else {
      const { r, g, b } = config.circleConnectionColor
      circleConnectionColor = new Rgba(r, g, b, 1)
    }

    return {
      circleCount,
      circleColor,
      circleConnectionMaxDistance,
      circleConnectionColor
    }
  }

  resize (): void {
    this._boundaries = Boundaries.GenerateFromCanvas(this._canvas)
    this._sceneUpdateSystem.resetBoundaries(this._boundaries)
    this._renderer.resetBoundaries(this._boundaries)

    this._renderer.draw()
  }

  resetCircleCount (circleCount: number): void {
    this._config.circleCount = circleCount
    this._scene.init(
      circleCount,
      this._boundaries,
      this._config.circleColor,
      this._config.circleConnectionColor
    )
  }

  init (): void {
    const {
      circleCount,
      circleColor,
      circleConnectionMaxDistance,
      circleConnectionColor
    } = this._config
    this._scene.init(circleCount, this._boundaries, circleColor, circleConnectionColor)
    this._sceneUpdateSystem = new SceneUpdateSystem(this._boundaries, this._scene, circleConnectionMaxDistance)
    this._renderer = new Renderer(this._ctx, this._boundaries, this._scene)
  }

  run (): void {
    this._isPaused = false

    const anime = (): void => {
      if (this._isPaused) {
        return
      }

      this._sceneUpdateSystem.update()
      this._renderer.draw()

      requestAnimationFrame(anime)
    }

    anime()
  }

  pause (): void {
    this._isPaused = true
  }
}
