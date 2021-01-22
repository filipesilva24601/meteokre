import { Component, Input, OnInit, ɵbypassSanitizationTrustStyle, ɵ_sanitizeUrl } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UrlObject } from 'url';
import { ApiService } from '../api.service';
import { ab2b64, b642ab } from "../helpers";

declare var M: any;

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css'],
})
export class FileViewComponent implements OnInit {
  fileId: string;
  encryptionKey: string;
  
  fileInfo: any;
  
  image: string;
  text: string;
  url;

  keyIsValid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private titleService: Title,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('View File');
    this.fileId = this.route.snapshot.paramMap.get('id');
  }

  validate(val: string) {
    let re = /^[a-zA-Z0-9+\/]+=*#[a-zA-Z0-9+\/]+=*$/;
    this.keyIsValid = re.test(val) && val.length == 41;
  }

  getFile() {
    this.text = null;
    this.image = null;
    this.url = null;
    
    const tmp = this.encryptionKey.split('#');
    const ivKey = tmp[0];
    const encKey = tmp[1];
    this.api
      .getFile(this.fileId, encKey, ivKey)
      .then((fileInfo) => {
        this.fileInfo = fileInfo;
        if (fileInfo.fileType === 'text/plain') {
          this.text = new TextDecoder().decode(b642ab(fileInfo.data));
        } else if (fileInfo.fileType.startsWith("image/")) {
          this.image = `data:${fileInfo.fileType};base64,${fileInfo.data}`;
        } 
        const temp = new Blob([b642ab(fileInfo.data)], {type: fileInfo.fileType});
        this.url = this.sanitizer.bypassSecurityTrustUrl((URL.createObjectURL(temp)));
      })
      .catch((err) => {
        //this.message = 'Failed to decrypt file.';
        M.toast({ html: 'Failed to decrypt file.', displayLength: 10000 });
      });
  }
}
