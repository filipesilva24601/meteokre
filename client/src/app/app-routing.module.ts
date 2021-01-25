import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FileViewComponent } from './fileview/fileview.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PastebinComponent } from './pastebin/pastebin.component';

const routes: Routes = [
  { path: 'pastebin', component: PastebinComponent },
  { path: 'fileview/:id', component: FileViewComponent },
  { path: 'fileview', component: FileViewComponent },
  { path: 'fileupload', component: FileuploadComponent },
  { path: '', redirectTo: '/pastebin', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
