import { Rgba } from './Rgba'

export class Line {
  private _startX: number
  private _startY: number
  private _endX: number
  private _endY: number
  private _rgba: Rgba

  get startX (): number {
    return this._startX
  }

  set startX (value: number) {
    this._startX = value
  }

  get startY (): number {
    return this._startY
  }

  set startY (value: number) {
    this._startY = value
  }

  get endX (): number {
    return this._endX
  }

  set endX (value: number) {
    this._endX = value
  }

  get endY (): number {
    return this._endY
  }

  set endY (value: number) {
    this._endY = value
  }

  get rgba (): Rgba {
    return this._rgba
  }

  set rgba (value: Rgba) {
    this._rgba = value
  }

  constructor (startX: number, startY: number, endX: number, endY: number, rgba: Rgba) {
    this._startX = startX
    this._startY = startY
    this._endX = endX
    this._endY = endY
    this._rgba = rgba
  }

  resetPositions (startX: number, startY: number, endX: number, endY: number): Line {
    this._startX = startX
    this._startY = startY
    this._endX = endX
    this._endY = endY
    return this
  }

  copy (): Line {
    return new Line(this._startX, this._startY, this._endX, this._endY, this._rgba.copy())
  }

  static CreateDefault (): Line {
    return new Line(0, 0, 0, 0, new Rgba(0, 0, 0, 0))
  }
}
