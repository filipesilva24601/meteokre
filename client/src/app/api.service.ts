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
  userroot: string = 'https://localhost:3000/users';

  constructor(private http: HttpClient) {}

  authcheck() {
    return this.http.get(`${this.userroot}/authcheck`, {
      withCredentials: true
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

  postMeta(encryptedData: ArrayBuffer) {
    const form = new FormData();
    form.append('file', new Blob([encryptedData]));

    return this.http.post(`${this.apiroot}/meta`, form, {
      withCredentials: true,
    });
  }

  postFile(encryptedData: ArrayBuffer, fileid: string) {
    const form = new FormData();
    form.append('file', new Blob([encryptedData]));

    return this.http.post(`${this.apiroot}/file/${fileid}`, form, {
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
      withCredentials: true
    });
  }
}
