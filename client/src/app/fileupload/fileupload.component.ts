import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, zip } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit {
  @ViewChild('filePicker') filePicker: ElementRef;
  filesToUpload: FileList;
  fileIds: any[];

  constructor(private api: ApiService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle("File Upload");

    document.body.addEventListener(
      'dragover',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
    document.body.addEventListener(
      'drop',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  }

  setFilesToUpload(files: FileList): void {
    this.filesToUpload = files;
  }

  uploadFile() {
    zip(
      ...Array.from(this.filesToUpload).map((file) => {
        return new Observable((subscriber) => {
          const reader = new FileReader();
          reader.onloadend = (r) => {
            this.api
              .postFile(reader.result, file.name, file.type)
              .then((res: any) => {
                res.file = file;
                subscriber.next(res);
              });
          };
          reader.readAsArrayBuffer(file);
        });
      })
    ).subscribe((res) => this.fileIds = res);
  }

  reset() {
    this.filesToUpload = null;
    this.fileIds = null;
    this.filePicker.nativeElement.files = null;
  }

  dropHandler(ev: DragEvent) {
    this.setFilesToUpload(ev.dataTransfer.files);
    this.filePicker.nativeElement.files = ev.dataTransfer.files;
  }

  dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();
  }
}
