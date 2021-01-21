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

@NgModule({
  declarations: [
    AppComponent,
    PastebinComponent,
    FileViewComponent,
    FileuploadComponent,
    FileuploadstatusComponent
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
