import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { ImageviewComponent } from './imageview/imageview.component';
import { PastebinComponent } from './pastebin/pastebin.component';

const routes: Routes = [
  { path: 'pastebin', component: PastebinComponent },
  { path: 'image/:id', component: ImageviewComponent },
  { path: 'fileupload', component: FileuploadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
