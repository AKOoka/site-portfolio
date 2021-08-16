import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PageAboutComponent } from './page-about.component'

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: PageAboutComponent }
  ])],
  exports: [RouterModule]
})

export class PageAboutRoutingModule {}
