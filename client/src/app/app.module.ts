import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PastebinComponent } from './pastebin/pastebin.component';
import { FileViewComponent } from './fileview/fileview.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FileuploadstatusComponent } from './fileuploadstatus/fileuploadstatus.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    PastebinComponent,
    FileViewComponent,
    FileuploadComponent,
    FileuploadstatusComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
