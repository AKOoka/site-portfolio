import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PageProjectsComponent } from './page-projects.component'

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: PageProjectsComponent }
  ])],
  exports: [RouterModule]
})

export class PageProjectsRoutingModule {}
