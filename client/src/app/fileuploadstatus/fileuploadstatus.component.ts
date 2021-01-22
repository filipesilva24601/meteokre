import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: '[app-fileuploadstatus]',
  templateUrl: './fileuploadstatus.component.html',
  styleUrls: ['./fileuploadstatus.component.css'],
})
export class FileuploadstatusComponent implements OnInit {
  @Input() file: File;
  @Input() fileName: string;
  fileid: string;
  encKey: string;
  ivKey: string;

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  uploadFileOnce() {
    if (this.fileid) {
      return;
    }
    this.uploadFile();
  }

  uploadFile() {
    if (this.fileid) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = (r) => {
      this.api
        .postFile(reader.result, this.file.name, this.file.type)
        .then((res: any) => {
          this.fileid = res.fileid;
          this.encKey = res.encKey;
          this.ivKey = res.ivKey;
        });
    };
    reader.readAsArrayBuffer(this.file);
  }
}
