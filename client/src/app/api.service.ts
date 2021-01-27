import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { ab2b64, b642ab } from './helpers';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiroot: string = 'https://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getFile(id, encKey, ivKey) {
    const dec = new TextDecoder();
    return window.crypto.subtle
      .importKey('raw', b642ab(encKey), 'AES-GCM', true, ['decrypt', 'encrypt'])
      .then((decKey) => {
        const decIVKey = b642ab(ivKey);

        return forkJoin([
          this.http
            .get(`${this.apiroot}/file/meta/${id}`, {
              responseType: 'blob',
            })
            .pipe(
              switchMap(async (blob: Blob) => {
                const blobBuffer = await blob.arrayBuffer();
                return window.crypto.subtle
                  .decrypt(
                    { name: 'AES-GCM', iv: decIVKey },
                    decKey,
                    blobBuffer
                  )
                  .then((t) => {
                    return JSON.parse(dec.decode(t));
                  });
              })
            ),
          this.http
            .get(`${this.apiroot}/file/${id}`, {
              responseType: 'blob',
            })
            .pipe(
              switchMap(async (blob: Blob) => {
                const blobBuffer = await blob.arrayBuffer();
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
              return {
                fileName: meta.fileName,
                fileType: meta.fileType,
                data: file,
              };
            }),
            first()
          )
          .toPromise();
      });
  }

  postMeta(encryptedData: ArrayBuffer) {
    const form = new FormData();
    form.append('file', new Blob([encryptedData]));

    return this.http
      .post(`${this.apiroot}/file/meta`, form);
  }

  postFile(encryptedData: ArrayBuffer, fileid: string) {
    const form = new FormData();
    form.append('file', new Blob([encryptedData]));

    return this.http
      .post(`${this.apiroot}/file/upload/${fileid}`, form);
  }
}
