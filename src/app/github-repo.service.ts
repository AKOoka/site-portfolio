import { Injectable } from '@angular/core'
import { Endpoints } from '@octokit/types'
import { Octokit } from 'octokit'

export interface IRepoInfo {
  name: string
  description: string | null
  hrefGithub: string
  hrefSite: string | null
  language: string | null
  topics: string[] | null
}

type RepoListResponse = Endpoints['GET /user/repos']['response']
type RepoLanguagesResponse = Endpoints['GET /repos/{owner}/{repo}/languages']['response']

const programmingLanguages: string[] = ['TypeScript', 'JavaScript', 'C#']

@Injectable({
  providedIn: 'root'
})

export class GithubRepoService {
  private readonly _octokit: Octokit
  private _reposInfoRequest: Promise<RepoListResponse> | null
  private _readingRequest: boolean
  private _reposInfo: Promise<IRepoInfo[]> | null

  constructor () {
    this._octokit = new Octokit({ auth: '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' })
    this._reposInfoRequest = null
    this._readingRequest = false
    this._reposInfo = null
  }

  async init (): Promise<void> {
    if (this._reposInfoRequest !== null) {
      return
    }

    this._reposInfoRequest = this._octokit.request('GET /user/repos', {
      visibility: 'public',
      sort: 'pushed',
      mediaType: {
        previews: [
          'mercy'
        ]
      }
    })

    if (this._reposInfo === null && !this._readingRequest) {
      this._reposInfo = this._getRepoInfoFromRequestRepoList(await this._reposInfoRequest)
    }
  }

  private _getProgrammingLanguage (languages: Record<string, number>): string | null {
    let lang: [string | null, number] = [null, 0]

    for (const entry of Object.entries(languages)) {
      const [langName, langPopularityInRepo] = entry

      if (programmingLanguages.includes(langName) && langPopularityInRepo > lang[1]) {
        lang = entry
      }
    }

    return lang[0]
  }

  private async _getRepoInfoFromRequestRepoList (request: RepoListResponse): Promise<IRepoInfo[]> {
    if (this._readingRequest) {
      if (this._reposInfo === null) {
        throw new Error("can't get repo info from request repo list")
      }

      return await this._reposInfo
    }

    this._readingRequest = true

    const reposInfo: IRepoInfo[] = []
    const { data } = request
    const languageRequests: Array<Promise<RepoLanguagesResponse>> = []

    for (const d of data) {
      languageRequests.push(Promise.resolve(
        this._octokit.request(
          'GET /repos/{owner}/{repo}/languages',
          { owner: d.owner?.login ?? 'AKOoka', repo: d.name }
        )
      ))
    }

    const reposLanguagesResponse: RepoLanguagesResponse[] = await Promise.all(languageRequests)

    for (let i = 0; i < data.length; i++) {
      const d = data[i]

      if (/(github.io|config)/.test(d.name.toLowerCase())) {
        continue
      }

      const language: string | null = this._getProgrammingLanguage(reposLanguagesResponse[i].data)

      reposInfo.push({
        name: d.name.slice(0, 1).toUpperCase() + d.name.slice(1).replace(/-/g, ' '),
        description: d.description,
        hrefGithub: d.html_url,
        hrefSite: d.homepage?.length === 0 ? null : d.homepage, // even if homepage link in repo is empty it still sends empty string instead of null
        language: language === null ? d.language : language,
        topics: d.topics === undefined ? null : d.topics
      })
    }

    return reposInfo
  }

  async getAllReposInfo (): Promise<IRepoInfo[]> {
    if (this._reposInfoRequest === null) {
      throw new Error('you need initialize before getting info')
    }

    if (this._reposInfo === null) {
      this._reposInfo = this._getRepoInfoFromRequestRepoList(await this._reposInfoRequest)
    }

    return await this._reposInfo
  }
}
