import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { ab2b64, b642ab } from './helpers';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiroot: string = 'api';
  userroot: string = 'users';

  constructor(private http: HttpClient) {}

  authcheck() {
    return this.http.get(`${this.userroot}/authcheck`, {
      withCredentials: true,
    });
  }

  getMeta(id) {
    return this.http.get(`${this.apiroot}/meta/${id}`, {
      responseType: 'blob',
    });
  }

  getFile(id) {
    return this.http.get(`${this.apiroot}/file/${id}`, {
      responseType: 'blob',
    });
  }

  postFile(encryptedData: ArrayBuffer, encryptedMeta: ArrayBuffer) {
    const form = new FormData();
    form.append('meta', new File([encryptedMeta], 'meta'));
    form.append('file', new File([encryptedData], 'file'));

    return this.http.post(`${this.apiroot}/file`, form, {
      withCredentials: true,
    });
  }

  login(username: string, password: string) {
    const data = { username: username, password: password };
    return this.http.post(`${this.userroot}/login`, data, {
      withCredentials: true,
      observe: 'response',
    });
  }

  logout() {
    return this.http.post(
      `${this.userroot}/logout`,
      {},
      { withCredentials: true }
    );
  }

  register(username: string, password: string) {
    const data = { username: username, password: password };
    return this.http.post(`${this.userroot}/register`, data, {
      withCredentials: true,
    });
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.apiroot}/files`, {
      responseType: 'json',
    });
  }
}
