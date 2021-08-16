import { Boundaries } from './Boundaries'
import { Circle } from './Circle'

type CirclesGrid = Circle[][][]

export class SceneGrid {
  private _grid!: CirclesGrid
  private _cellSize!: number

  get grid (): Readonly<CirclesGrid> {
    return this._grid
  }

  clear (): void {
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid[i].length; j++) {
        this._grid[i][j] = []
      }
    }
  }

  private _generateGrid (boundaries: Boundaries, cellSize: number): CirclesGrid {
    const grid: CirclesGrid = []
    const gridRowCount: number = Math.ceil(boundaries.endY / cellSize)
    const gridColumnCount: number = Math.ceil(boundaries.endX / cellSize)

    for (let row = 0; row < gridRowCount; row++) {
      grid.push([])

      for (let column = 0; column < gridColumnCount; column++) {
        grid[row].push([])
      }
    }

    return grid
  }

  init (boundaries: Boundaries, cellSize: number): void {
    this._cellSize = cellSize
    this._grid = this._generateGrid(boundaries, cellSize)
  }

  resetBoundaries (boundaries: Boundaries): void {
    this._grid = this._generateGrid(boundaries, this._cellSize)
  }

  private _isCircleInCell (circle: Circle, row: number, column: number): boolean {
    const startX: number = column * this._cellSize
    const startY: number = row * this._cellSize
    const endX: number = startX + this._cellSize
    const endY: number = startY + this._cellSize

    return circle.x >= startX && circle.x <= endX && circle.y >= startY && circle.y <= endY
  }

  addCircle (circle: Circle): void {
    for (let row = 0; row < this._grid.length; row++) {
      for (let column = 0; column < this._grid[row].length; column++) {
        if (this._isCircleInCell(circle, row, column)) {
          this._grid[row][column].push(circle)
          return
        }
      }
    }
  }
}
