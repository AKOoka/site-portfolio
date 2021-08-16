import { Boundaries } from './Boundaries'
import { Circle } from './Circle'
import { Line } from './Line'
import { Rgba } from './Rgba'

export class Scene {
  private _poolCircle!: Circle[]
  private _poolLine!: Line[]
  private _activeLineLastIndex!: number

  get poolCircle (): Readonly<Circle[]> {
    return this._poolCircle
  }

  get poolLine (): Readonly<Line[]> {
    return this._poolLine
  }

  get activeLineLastIndex (): number {
    return this._activeLineLastIndex
  }

  private _generateLines (poolCircleLength: number, templateLine: Line): Line[] {
    const poolLine: Line[] = []

    for (let i = 0; i < poolCircleLength * poolCircleLength; i++) {
      poolLine.push(templateLine.copy())
    }

    return poolLine
  }

  addLine (startX: number, startY: number, endX: number, endY: number, alphaChanel: number): void {
    const line: Line = this._poolLine[this._activeLineLastIndex]

    line.resetPositions(startX, startY, endX, endY)
    line.rgba.a = alphaChanel

    this._activeLineLastIndex = this._activeLineLastIndex + 1
  }

  clearPoolLine (): void {
    this._activeLineLastIndex = 0
  }

  init (
    circleCount: number,
    boundaries: Boundaries,
    templateCircleColor: Rgba,
    templateLineColor: Rgba
  ): void {
    const randomInRange = (min: number, max: number): number => Math.random() * (max - min + 1) + min
    const randomDirection = (): number => Math.round(Math.random()) * -2 + 1

    this._poolCircle = []

    for (let i = 0; i < circleCount; i++) {
      this._poolCircle.push(
        new Circle(
          randomInRange(boundaries.startX, boundaries.endX),
          randomInRange(boundaries.startY, boundaries.endY),
          4,
          randomInRange(0.1, 0.5) * randomDirection(),
          randomInRange(0.1, 0.5) * randomDirection(),
          templateCircleColor.copy()
        )
      )
    }

    this._activeLineLastIndex = 0
    this._poolLine = this._generateLines(this._poolCircle.length, new Line(0, 0, 0, 0, templateLineColor))
  }
}
