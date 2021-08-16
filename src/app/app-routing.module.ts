import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { PageHomeComponent } from './page-home/page-home.component'

const routes: Routes = [
  {
    path: '',
    component: PageHomeComponent
  },
  {
    path: 'about',
    loadChildren: async () => (await import('./page-about/page-about.module')).PageAboutModule
  },
  {
    path: 'projects',
    loadChildren: async () => (await import('./page-projects/page-projects.module')).PageProjectsModule
  },
  {
    path: '**',
    component: PageHomeComponent
  }
]

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: PreloadAllModules }
    )
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
