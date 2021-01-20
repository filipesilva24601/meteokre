import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FileViewComponent } from './fileview/fileview.component';
import { PastebinComponent } from './pastebin/pastebin.component';

const routes: Routes = [
  { path: 'pastebin', component: PastebinComponent },
  { path: 'file/:id', component: FileViewComponent },
  { path: 'file', component: FileViewComponent },
  { path: 'fileupload', component: FileuploadComponent },
  { path: '**', redirectTo: '/pastebin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
