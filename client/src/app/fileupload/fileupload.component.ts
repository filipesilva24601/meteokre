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
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FileuploadstatusComponent } from '../fileuploadstatus/fileuploadstatus.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent implements OnInit, OnDestroy {
  @ViewChildren(FileuploadstatusComponent)
  statuses: QueryList<FileuploadstatusComponent>;
  @ViewChild('filePicker') filePicker: ElementRef;
  filesToUpload: File[] = [];

  constructor(
    private titleService: Title,
    private userService: UserService,
    private router: Router
  ) {}

  private handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ngOnInit(): void {
    this.userService.loggedIn.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['/fileview']);
      }
    });

    this.titleService.setTitle('File Upload');

    document.body.addEventListener('dragover', this.handleDrag, false);
    document.body.addEventListener('drop', this.handleDrag, false);
  }

  ngOnDestroy() {
    document.body.removeEventListener('dragover', this.handleDrag, false);
    document.body.removeEventListener('drop', this.handleDrag, false);
  }

  setFilesToUpload(target): void {
    Array.from(target).forEach((file: File) => {
      this.filesToUpload.push(file);
    });
  }

  uploadFile() {
    this.statuses.map((s) => s.uploadFileOnce());
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
