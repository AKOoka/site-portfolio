import { Boundaries } from './Boundaries'
import { Circle } from './Circle'
import { Scene } from './Scene'
import { SceneGrid } from './SceneGrid'

type CreateCirclePairsInNeighborCellCallback = (
  circle: Circle,
  row: number,
  column: number
) => void

export class SceneUpdateSystem {
  private readonly _scene: Scene
  private readonly _sceneGrid: SceneGrid
  private _boundaries: Boundaries
  private _lineMaxLength: number

  constructor (boundaries: Boundaries, scene: Scene, lineMaxLength: number) {
    this._boundaries = boundaries
    this._scene = scene
    this._lineMaxLength = lineMaxLength
    this._sceneGrid = new SceneGrid()

    this._sceneGrid.init(boundaries, lineMaxLength)
  }

  private _createCirclePair (firstCircle: Circle, secondCircle: Circle, invertedLineMaxLength: number): void {
    const differenceX: number = firstCircle.x - secondCircle.x
    const differenceY: number = firstCircle.y - secondCircle.y
    const distanceSqr: number = differenceX * differenceX + differenceY * differenceY

    if (distanceSqr <= this._lineMaxLength * this._lineMaxLength) {
      this._scene.addLine(
        firstCircle.x,
        firstCircle.y,
        secondCircle.x,
        secondCircle.y,
        1 - invertedLineMaxLength * distanceSqr
      )
    }
  }

  private _createLineBetweenCirclesInCell (circle: Circle, gridCell: Readonly<Circle[]>, startIndex: number = 0): void {
    const lineMaxLengthSquared: number = this._lineMaxLength * this._lineMaxLength
    const invertedLineMaxLengthSquared: number = 1 / lineMaxLengthSquared

    for (let i = startIndex; i < gridCell.length; i++) {
      this._createCirclePair(circle, gridCell[i], invertedLineMaxLengthSquared)
    }
  }

  private _createLineBetweenCirclesInsideCell (gridCell: Readonly<Circle[]>): void {
    const lineMaxLengthSquared: number = this._lineMaxLength * this._lineMaxLength
    const invertedLineMaxLengthSquared: number = 1 / lineMaxLengthSquared

    for (let i = 0; i < gridCell.length; i++) {
      const firstCircle: Circle = gridCell[i]

      for (let l = i + 1; l < gridCell.length; l++) {
        const secondCircle: Circle = gridCell[l]

        this._createCirclePair(firstCircle, secondCircle, invertedLineMaxLengthSquared)
      }
    }
  }

  private _createCirclePairsInGridPart (
    rowStart: number,
    rowEnd: number,
    columnStart: number,
    columnEnd: number,
    neighborCellCallback: CreateCirclePairsInNeighborCellCallback
  ): void {
    for (let row = rowStart; row < rowEnd; row++) {
      for (let column = columnStart; column < columnEnd; column++) {
        const centerCell: Circle[] = this._sceneGrid.grid[row][column]

        this._createLineBetweenCirclesInsideCell(centerCell)

        for (const circle of centerCell) {
          neighborCellCallback(circle, row, column)
        }
      }
    }
  }

  private _createCirclePairsInGrid (): void {
    const lastRow: number = this._sceneGrid.grid.length - 1
    const lastColumn: number = this._sceneGrid.grid[lastRow].length - 1

    this._createCirclePairsInGridPart(
      0,
      lastRow,
      1,
      lastColumn,
      (circle, row, column) => {
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row][column + 1])
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column + 1])
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column])
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column - 1])
      }
    )

    this._createCirclePairsInGridPart(
      0,
      lastRow,
      lastColumn,
      lastColumn + 1,
      (circle, row, column) => {
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column])
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column - 1])
      }
    )

    this._createCirclePairsInGridPart(
      lastRow,
      lastRow + 1,
      0,
      lastColumn,
      (circle, row, column) => {
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row][column + 1])
      }
    )

    this._createCirclePairsInGridPart(
      0,
      lastRow,
      0,
      1,
      (circle, row, column) => {
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row][column + 1])
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column + 1])
        this._createLineBetweenCirclesInCell(circle, this._sceneGrid.grid[row + 1][column])
      }
    )

    this._createLineBetweenCirclesInsideCell(this._sceneGrid.grid[lastRow][lastColumn])
  }

  resetBoundaries (boundaries: Boundaries): void {
    this._boundaries = boundaries
    this._sceneGrid.resetBoundaries(boundaries)
  }

  resetLineMaxLength (lineMaxLength: number): void {
    this._lineMaxLength = lineMaxLength
  }

  update (): void {
    this._scene.clearPoolLine()
    this._sceneGrid.clear()

    for (const circle of this._scene.poolCircle) {
      circle.x = (this._boundaries.endX + circle.x + circle.speedX) % this._boundaries.endX
      circle.y = (this._boundaries.endY + circle.y + circle.speedY) % this._boundaries.endY

      this._sceneGrid.addCircle(circle)
    }

    this._createCirclePairsInGrid()
  }
}
