import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

function ab2b64(arrbuf: ArrayBuffer) {
  const buf = new Uint8Array(arrbuf);
  let s: string = '';
  for (let i = 0; i < buf.length; i++) {
    s = s + String.fromCharCode(buf[i])
  }
  return window.btoa(s);
}
function b642ab(str64: string) {
  const str = window.atob(str64);
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiroot: string = 'https://localhost:3000/api';

  constructor(private http: HttpClient) {}

  async getFile(id, encKey, ivKey): Promise<any> {
    const dec = new TextDecoder();
    const decKey = await window.crypto.subtle.importKey(
      'raw',
      b642ab(encKey),
      'AES-GCM',
      true,
      ['decrypt', 'encrypt']
    );
    const decIVKey = b642ab(ivKey);
    return this.http
      .get(`${this.apiroot}/file/${id}`, {
        responseType: 'blob',
      })
      .pipe(
        switchMap(async (blob: Blob) => {
          const blobBuffer = await blob.arrayBuffer();
          return window.crypto.subtle
            .decrypt({ name: 'AES-GCM', iv: decIVKey }, decKey, blobBuffer)
            .then((t) => {
              return JSON.parse(dec.decode(t));
            });
        }),
        first()
      )
      .toPromise();
  }

  async postFile(fileBuffer: any, fileName, fileType): Promise<any> {
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 128 },
      true,
      ['encrypt', 'decrypt']
    );
    const base64key = ab2b64(await window.crypto.subtle.exportKey('raw', key));
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      enc.encode(
        JSON.stringify({
          fileName: fileName,
          fileType: fileType,
          data: ab2b64(fileBuffer),
        })
      )
    );

    const form = new FormData();
    form.append('file', new Blob([encrypted]), '');
    return this.http
      .post(`${this.apiroot}/file`, form)
      .pipe(
        map((res: any) => {
          res.encKey = base64key;
          res.ivKey = ab2b64(iv);
          return res;
        }),
        first()
      ).toPromise();
  }
}
