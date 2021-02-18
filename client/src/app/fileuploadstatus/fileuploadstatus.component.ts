import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { b642ab, ab2b64 } from '../helpers';

@Component({
  selector: '[app-fileuploadstatus]',
  templateUrl: './fileuploadstatus.component.html',
  styleUrls: ['./fileuploadstatus.component.css'],
})
export class FileuploadstatusComponent implements OnInit {
  message: string = 'Not uploaded';
  @Input() file: File;
  @Input() fileName: string;
  fileid: string;
  encKey: string;
  ivKey: string;

  total: number = 0;
  progress: number = 0;

  uploading: boolean = false;
  showProgress: boolean = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  uploadFileOnce() {
    if (this.fileid) {
      return;
    }
    this.uploadFile();
  }

  uploadFile() {
    if (this.uploading) {
      return;
    }

    this.uploading = true;

    const enc = new TextEncoder();

    window.crypto.subtle
      .generateKey({ name: 'AES-GCM', length: 128 }, true, [
        'encrypt',
        'decrypt',
      ])
      .then((key) => {
        window.crypto.subtle.exportKey('raw', key).then((rkey) => {
          this.encKey = ab2b64(rkey);

          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          this.ivKey = ab2b64(iv);

          window.crypto.subtle
            .encrypt(
              { name: 'AES-GCM', iv: iv },
              key,
              enc.encode(
                JSON.stringify({
                  fileName: this.file.name,
                  fileType: this.file.type,
                })
              )
            )
            .then((encryptedMetadata) => {
              this.message = 'Reading file';
              this.file
                .arrayBuffer()
                .then((ab) => {
                  this.message = 'Encrypting file';
                  window.crypto.subtle
                    .encrypt({ name: 'AES-GCM', iv: iv }, key, ab)
                    .then((encryptedData) => {
                      this.message = 'Uploading file';
                      this.showProgress = true;
                      this.api
                        .postFile(encryptedData, encryptedMetadata)
                        .pipe(
                          map((event: HttpEvent<any>) => {
                            switch (event.type) {
                              case HttpEventType.UploadProgress:
                                this.total = event.total;
                                this.progress = event.loaded;
                                break;
                              case HttpEventType.Response:
                                this.fileid = event.body.fileid;
                                this.showProgress = false;
                                this.message = 'Finished uploading file';
                                break;
                              default:
                                break;
                            }
                          }),
                          catchError((err) => {
                            console.log(err);
                            this.message = 'Failed to upload file.';
                            throw new Error('');
                          })
                        )
                        .toPromise();
                    });
                })
                .finally(() => {
                  this.uploading = false;
                });
            });
        });
      });
  }
}
