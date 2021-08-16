import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { App as CanvasAnimation } from '../../libs/wiring-dots-animation/App'
import { IAppUserConfig as ICanvasAnimationConfig } from '../../libs/wiring-dots-animation/IAppConfig'

const circleCountForBigScreen: number = 75
const circleCountForSmallScreen: number = 25

const animationConfig: ICanvasAnimationConfig = {
  circleCount: circleCountForBigScreen,
  circleColor: { r: 247, g: 129, b: 102 },
  circleConnectionMaxDistance: 200,
  circleConnectionColor: { r: 181, g: 132, b: 121 }
}

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements AfterViewInit {
  private _canvasAnimation!: CanvasAnimation
  private _smallScreen: boolean
  @ViewChild('canvas') private readonly _canvasRef!: ElementRef

  constructor () {
    this._smallScreen = false
  }

  private _updateCanvas (): void {
    const { nativeElement: canvas } = this._canvasRef

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this._canvasAnimation.resize()

    if (window.innerWidth <= 736 && !this._smallScreen) {
      this._smallScreen = true
      this._canvasAnimation.resetCircleCount(circleCountForSmallScreen)
    } else if (window.innerWidth > 736 && this._smallScreen) {
      this._smallScreen = false
      this._canvasAnimation.resetCircleCount(circleCountForBigScreen)
    }
  }

  ngAfterViewInit (): void {
    const { nativeElement: canvas } = this._canvasRef

    this._canvasAnimation = new CanvasAnimation(canvas, canvas.getContext('2d'), animationConfig)
    this._canvasAnimation.init()

    this._updateCanvas()

    this._canvasAnimation.run()

    window.onresize = this._updateCanvas.bind(this)
  }
}
