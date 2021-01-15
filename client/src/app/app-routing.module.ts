import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PastebinComponent } from './pastebin/pastebin.component';

const routes: Routes = [
  { path: 'pastebin', component: PastebinComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}