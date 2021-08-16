import { Circle } from './Circle'

export class Boundaries {
  private readonly _startX: number
  private readonly _startY: number
  private readonly _endX: number
  private readonly _endY: number
  private readonly _width: number
  private readonly _height: number

  get startX (): number {
    return this._startX
  }

  get startY (): number {
    return this._startY
  }

  get endX (): number {
    return this._endX
  }

  get endY (): number {
    return this._endY
  }

  get width (): number {
    return this._width
  }

  get height (): number {
    return this._height
  }

  constructor (startX: number, startY: number, endX: number, endY: number) {
    this._startX = startX
    this._startY = startY
    this._endX = endX
    this._endY = endY
    this._width = this._endX - this._startX
    this._height = this._endY - this._startY
  }

  isCircleIn (circle: Circle): boolean {
    return (circle.y >= this._startY && circle.y <= this._endY) &&
           (circle.x >= this._startX && circle.x <= this._endX)
  }

  static GenerateFromCanvas (canvas: HTMLCanvasElement): Boundaries {
    return new Boundaries(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height)
  }
}
