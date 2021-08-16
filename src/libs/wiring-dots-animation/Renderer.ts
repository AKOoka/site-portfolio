import { Boundaries } from './Boundaries'
import { Scene } from './Scene'

export class Renderer {
  private readonly _ctx: CanvasRenderingContext2D
  private _boundaries: Boundaries
  private readonly _scene: Scene

  constructor (ctx: CanvasRenderingContext2D, boundaries: Boundaries, scene: Scene) {
    this._ctx = ctx
    this._boundaries = boundaries
    this._scene = scene
  }

  resetBoundaries (boundaries: Boundaries): void {
    this._boundaries = boundaries
  }

  draw (): void {
    this._ctx.clearRect(0, 0, this._boundaries.width, this._boundaries.height)

    this._ctx.lineWidth = 2

    for (let i = 0; i < this._scene.activeLineLastIndex; i++) {
      this._ctx.beginPath()
      this._ctx.strokeStyle = this._scene.poolLine[i].rgba.stringValue
      this._ctx.moveTo(this._scene.poolLine[i].startX, this._scene.poolLine[i].startY)
      this._ctx.lineTo(this._scene.poolLine[i].endX, this._scene.poolLine[i].endY)
      this._ctx.stroke()
    }

    this._ctx.fillStyle = this._scene.poolCircle[0].rgba.stringValue
    const tau = Math.PI * 2

    for (const circle of this._scene.poolCircle) {
      this._ctx.beginPath()
      this._ctx.arc(circle.x, circle.y, circle.radius, 0, tau)
      this._ctx.fill()
    }
  }
}
