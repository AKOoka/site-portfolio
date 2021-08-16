export interface IRgb {
  r: number
  g: number
  b: number
}

export class Rgba implements IRgb {
  private _r: number
  private _g: number
  private _b: number
  private _a: number
  private _stringValue!: string

  get r (): number {
    return this._r
  }

  set r (value: number) {
    this._r = value
    this._createStringValue()
  }

  get g (): number {
    return this._g
  }

  set g (value: number) {
    this._g = value
    this._createStringValue()
  }

  get b (): number {
    return this._b
  }

  set b (value: number) {
    this._b = value
    this._createStringValue()
  }

  get a (): number {
    return this._a
  }

  set a (value: number) {
    this._a = value
    this._createStringValue()
  }

  get stringValue (): string {
    return this._stringValue
  }

  constructor (r: number, g: number, b: number, a: number) {
    this._r = r
    this._g = g
    this._b = b
    this._a = a
    this._createStringValue()
  }

  private _createStringValue (): void {
    this._stringValue = `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`
  }

  copy (): Rgba {
    return new Rgba(this._r, this._g, this._b, this._a)
  }

  static CreateDefault (): Rgba {
    return new Rgba(0, 0, 0, 1)
  }
}
