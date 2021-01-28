import {
  Component,
  Input,
  OnInit,
  ɵbypassSanitizationTrustStyle,
  ɵ_sanitizeUrl,
} from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { ab2b64, b642ab } from '../helpers';

declare var M: any;

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css'],
})
export class FileViewComponent implements OnInit {
  fileId: string;
  encryptionKey: string;
  fileName: string;
  message: string = '';

  image: string;
  viewImage: boolean = false;
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

  viewImageToggle() {
    this.viewImage = !this.viewImage;
  }

  getFile() {
    this.text = null;
    this.image = null;
    this.url = null;

    const tmp = this.encryptionKey.split('#');
    const ivKey = tmp[0];
    const encKey = tmp[1];

    const dec = new TextDecoder();

    window.crypto.subtle
      .importKey('raw', b642ab(encKey), 'AES-GCM', true, ['decrypt', 'encrypt'])
      .then((decKey) => {
        const decIVKey = b642ab(ivKey);

        this.message = 'Downloading file';
        return forkJoin([
          this.api.getMeta(this.fileId).pipe(
            switchMap(async (blob: Blob) => {
              const blobBuffer = await blob.arrayBuffer();
              return window.crypto.subtle
                .decrypt({ name: 'AES-GCM', iv: decIVKey }, decKey, blobBuffer)
                .then((t) => {
                  return JSON.parse(dec.decode(t));
                });
            })
          ),
          this.api.getFile(this.fileId).pipe(
            switchMap(async (blob: Blob) => {
              const blobBuffer = await blob.arrayBuffer();
              this.message = 'Decrypting file';
              return window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: decIVKey },
                decKey,
                blobBuffer
              );
            })
          ),
        ])
          .pipe(
            map(([meta, file]) => {
              this.message = 'File decrypted';
              this.fileName = meta.fileName;
              if (meta.fileType === 'text/plain') {
                this.text = new TextDecoder().decode(file);
              } else if (meta.fileType.startsWith('image/')) {
                this.image = `data:${meta.fileType};base64,${ab2b64(file)}`;
              }
              const temp = new Blob([file], { type: meta.fileType });
              this.url = this.sanitizer.bypassSecurityTrustUrl(
                URL.createObjectURL(temp)
              );
            })
          )
          .toPromise();
      });
  }
}
