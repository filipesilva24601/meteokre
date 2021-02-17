import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FileViewComponent } from './fileview/fileview.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PastebinComponent } from './pastebin/pastebin.component';
import { RegisterComponent } from './register/register.component';
import { ViewUserFilesComponent } from './view-user-files/view-user-files.component';

const routes: Routes = [
  { path: 'pastebin', component: PastebinComponent },
  { path: 'fileview/:id', component: FileViewComponent },
  { path: 'fileview', component: FileViewComponent },
  { path: 'fileupload', component: FileuploadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'viewuserfiles', component: ViewUserFilesComponent },
  { path: '', redirectTo: '/pastebin', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
