import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { forkJoin, Observable, zip } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit, OnDestroy {
  @ViewChild('filePicker') filePicker: ElementRef;
  filesToUpload: File[];
  fileIds: any[];

  constructor(private api: ApiService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('File Upload');

    this.filesToUpload = [];
    this.fileIds = [];

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

  ngOnDestroy() {
    this.fileIds = [];
    this.filesToUpload = [];
  }

  setFilesToUpload(files: FileList): void {
    Array.from(files).forEach((file) => {
      this.filesToUpload.push(file);
    });
  }

  uploadFile() {
    forkJoin(
      this.filesToUpload.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = (r) => {
            this.api
              .postFile(reader.result, file.name, file.type)
              .then((res: any) => {
                res.file = file;
                resolve(res);
              });
          };
          reader.readAsArrayBuffer(file);
        });
      })
    ).subscribe((res) => {
      this.fileIds = res;
    });
  }

  reset() {
    this.filesToUpload = [];
    this.fileIds = [];
    this.filePicker.nativeElement.files = null;
  }

  dropHandler(ev: DragEvent) {
    this.setFilesToUpload(ev.dataTransfer.files);
  }

  dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();
  }
}
