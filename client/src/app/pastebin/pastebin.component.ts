import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../api.service';
import { FileuploadstatusComponent } from '../fileuploadstatus/fileuploadstatus.component';

@Component({
  selector: 'app-pastebin',
  templateUrl: './pastebin.component.html',
  styleUrls: ['./pastebin.component.css'],
})
export class PastebinComponent implements OnInit, AfterViewInit {
  filesToUpload: File[] = [];
  @ViewChildren(FileuploadstatusComponent)
  statuses: QueryList<FileuploadstatusComponent>;
  @Input() fileName: string;
  @Input() text: string;
  fileInfo: any;

  constructor(private api: ApiService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Pastebin');
  }

  ngAfterViewInit() {
    this.statuses.notifyOnChanges();
    this.statuses.changes.subscribe((qlist) => {
      qlist.map((f: FileuploadstatusComponent) => {
        f.uploadFileOnce();
      });
    });
  }

  uploadText() {
    const enc = new TextEncoder();
    const abText = enc.encode(this.text);
    this.filesToUpload.push(
      new File([abText], this.fileName, { type: 'text/plain' })
    );
  }
}
