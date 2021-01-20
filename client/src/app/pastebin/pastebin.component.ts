import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-pastebin',
  templateUrl: './pastebin.component.html',
  styleUrls: ['./pastebin.component.css'],
})
export class PastebinComponent implements OnInit {
  @Input() fileName: string;
  @Input() text: string;
  fileInfo: any;

  constructor(private api: ApiService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Pastebin');
  }

  uploadText() {
    const enc = new TextEncoder();
    const abText = enc.encode(this.text);
    console.log(abText);
    this.api
      .postFile(abText, this.fileName, 'text/plain')
      .then((res) => (this.fileInfo = res));
  }

}
