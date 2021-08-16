import { animate, AnimationEvent, keyframes, state, style, transition, trigger } from '@angular/animations'
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router, Routes } from '@angular/router'
import { GithubRepoService } from './github-repo.service'

interface INavigationLink {
  path: string
  text: string
  isActive: boolean
}

enum AnimationState {
  OPEN = 'open',
  CLOSED = 'closed',
  REOPEN = 'reopen',
  ANY = '*'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  animations: [
    trigger('routeTransition', [
      state(`${AnimationState.OPEN}`, style({
        overflow: 'auto',
        opacity: '1',
        transform: 'scale(1)'
      })),
      state(AnimationState.CLOSED, style({
        overflow: 'hidden',
        opacity: '0',
        transform: 'scale(0.9)'
      })),
      transition(`${AnimationState.ANY} => ${AnimationState.CLOSED}`, [
        animate('100ms', keyframes([
          style({ overflow: 'hidden', transform: 'scale(1)', opacity: '1', offset: 0 }),
          style({ transform: 'scale(0.9)', opacity: '0', offset: 1 })
        ]))
      ]),
      transition(`${AnimationState.ANY} => ${AnimationState.OPEN}`, [
        animate('350ms', keyframes([
          style({ overflow: 'hidden', transform: 'scale(0.9)', opacity: '0', offset: 0 }),
          style({ overflow: 'hidden', transform: 'scale(1)', opacity: '1', offset: 0.99 }),
          style({ overflow: 'auto', transform: 'scale(1)', opacity: '1', offset: 1 })
        ]))
      ])
    ])
  ]
})

export class AppComponent implements OnInit {
  private readonly _router: Router
  private readonly _githubRepoService: GithubRepoService
  private _navigationLinks: Map<string, INavigationLink>
  private _isMainClosed: AnimationState
  private _currentPath: string
  private _nextPath: string

  get pageClosedStatus (): AnimationState {
    return this._isMainClosed
  }

  get navigationLinks (): Readonly<INavigationLink[]> {
    return [...this._navigationLinks.values()]
  }

  constructor (router: Router, location: Location, githubRepoService: GithubRepoService) {
    this._router = router
    this._githubRepoService = githubRepoService
    this._navigationLinks = new Map()
    this._isMainClosed = AnimationState.REOPEN
    this._currentPath = ''
    this._nextPath = location.path().slice(1)
  }

  private _generateLinks (routes: Routes): Map<string, INavigationLink> {
    const links: Map<string, INavigationLink> = new Map()

    for (const r of routes) {
      if ((r.component !== undefined || r.loadChildren !== undefined) && r.path !== undefined && r.path !== '**') {
        if (r.path === '') {
          links.set(
            r.path,
            { path: r.path, text: 'HOME', isActive: false }
          )
        } else {
          links.set(
            r.path,
            { path: r.path, text: r.path.toUpperCase(), isActive: false }
          )
        }
      }
    }

    return links
  }

  ngOnInit (): void {
    this._githubRepoService.init().catch(err => console.log(err))

    this._navigationLinks = this._generateLinks(this._router.config)

    if (!this._navigationLinks.has(this._nextPath)) {
      this._nextPath = ''
    }

    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this._onRouteUpdate(e.urlAfterRedirects.slice(1))
      }
    })
  }

  private _updateLinks (): void {
    const currentPathLink = this._navigationLinks.get(this._currentPath)
    const nextPathLink = this._navigationLinks.get(this._nextPath)

    if (currentPathLink !== undefined) {
      currentPathLink.isActive = false
    }

    if (nextPathLink !== undefined) {
      nextPathLink.isActive = true
    }
  }

  private _onRouteUpdate (path: string): void {
    if (path !== this._nextPath) {
      this._isMainClosed = AnimationState.REOPEN
      this._nextPath = path
      this._updateLinks()
      this._currentPath = path
    } else {
      this._updateLinks()
      this._currentPath = this._nextPath
    }
  }

  onRouteTransitionEnd (event: AnimationEvent): void {
    if (event.toState === 'open') {
      return
    }

    if (this._nextPath !== 'projects') {
      this._router.navigateByUrl(this._nextPath).catch(err => console.log('router failed', err))
      this._isMainClosed = AnimationState.OPEN
      return
    }

    this._githubRepoService.getAllReposInfo()
      .then(() => {
        if (this._nextPath === 'projects') {
          this._router.navigateByUrl(this._nextPath).catch(err => console.log('router failed', err))
          this._isMainClosed = AnimationState.OPEN
        }
      })
      .catch(err => {
        this._isMainClosed = AnimationState.OPEN
        this._nextPath = this._currentPath
        console.log("can't get repos info", err)
      })
  }

  changePath (path: string): void {
    if (this._currentPath === path) {
      return
    }

    this._nextPath = path
    this._isMainClosed = AnimationState.CLOSED
  }
}
