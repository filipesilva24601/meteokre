import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit {
  filesToUpload: FileList;
  fileId: string;
  encryptionKey: string;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
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

  setFileToUpload(files: FileList): void {
    console.log(files);
    this.filesToUpload = files;
  }

  uploadFile() {
    const file = this.filesToUpload[0];
    const reader = new FileReader();
    reader.onloadend = (r) => {
      this.api
        .postFile(reader.result, file.name, file.type)
        .then((res: any) => {
          console.log(res);
          this.fileId = res.fileid;
          this.encryptionKey = `${res.ivKey}#${res.encKey}`;
        });
    };
    reader.readAsArrayBuffer(file);
  }

  reset() {
    this.filesToUpload = null;
    this.fileId = null;
  }

  dropHandler(ev: DragEvent) {
    console.log('File(s) dropped');

    this.setFileToUpload(ev.dataTransfer.files);
  }

  dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();
  }
}
