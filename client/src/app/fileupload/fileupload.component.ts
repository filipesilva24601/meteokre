import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../api.service';
import { FileuploadstatusComponent } from '../fileuploadstatus/fileuploadstatus.component';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit, OnDestroy {
  @ViewChildren(FileuploadstatusComponent) statuses: QueryList<FileuploadstatusComponent>;
  @ViewChild('filePicker') filePicker: ElementRef;
  filesToUpload: File[] = [];

  constructor(private api: ApiService, private titleService: Title) {}

  private handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ngOnInit(): void {
    this.titleService.setTitle('File Upload');

    document.body.addEventListener('dragover', this.handleDrag, false);
    document.body.addEventListener('drop', this.handleDrag, false);
  }

  ngOnDestroy() {
    document.body.removeEventListener('dragover', this.handleDrag, false);
    document.body.removeEventListener('drop', this.handleDrag, false);
  }

  setFilesToUpload(files: FileList): void {
    Array.from(files).forEach((file) => {
      this.filesToUpload.push(file);
    });
  }

  uploadFile() {
    this.statuses.map(s => s.uploadFileOnce());
  }

  reset() {
    this.filesToUpload = [];
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
