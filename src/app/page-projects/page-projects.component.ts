import { Component, OnInit } from '@angular/core'
import { GithubRepoService, IRepoInfo } from '../github-repo.service'

@Component({
  selector: 'app-page-projects',
  templateUrl: './page-projects.component.html',
  styleUrls: ['./page-projects.component.scss']
})

export class PageProjectsComponent implements OnInit {
  private readonly _githubRepoService: GithubRepoService
  private _reposInfo: IRepoInfo[]

  get reposInfo (): IRepoInfo[] {
    return this._reposInfo
  }

  constructor (githubRepoService: GithubRepoService) {
    this._githubRepoService = githubRepoService
    this._reposInfo = []
  }

  ngOnInit (): void {
    this._githubRepoService.getAllReposInfo()
      .then(repInfo => { this._reposInfo = repInfo })
      .catch(err => console.log(err))
  }
}
