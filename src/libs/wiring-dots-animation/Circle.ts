import { Rgba } from './Rgba'

export class Circle {
  private _x: number
  private _y: number
  private _radius: number
  private _speedX: number
  private _speedY: number
  private _rgba: Rgba

  get x (): number {
    return this._x
  }

  set x (value: number) {
    this._x = value
  }

  get y (): number {
    return this._y
  }

  set y (value: number) {
    this._y = value
  }

  get radius (): number {
    return this._radius
  }

  set radius (value: number) {
    this._radius = value
  }

  get speedX (): number {
    return this._speedX
  }

  set speedX (value: number) {
    this._speedX = value
  }

  get speedY (): number {
    return this._speedY
  }

  set speedY (value: number) {
    this._speedY = value
  }

  get rgba (): Rgba {
    return this._rgba
  }

  set rgba (value: Rgba) {
    this._rgba = value
  }

  constructor (x: number, y: number, radius: number, speedX: number, speedY: number, rgba: Rgba) {
    this._x = x
    this._y = y
    this._radius = radius
    this._speedX = speedX
    this._speedY = speedY
    this._rgba = rgba
  }

  copy (): Circle {
    return new Circle(this._x, this._y, this._radius, this._speedX, this._speedY, this._rgba.copy())
  }

  static CreateDefault (): Circle {
    return new Circle(0, 0, 0, 0, 0, new Rgba(0, 0, 0, 0))
  }
}
