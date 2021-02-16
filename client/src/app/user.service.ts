import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedIn: ReplaySubject<boolean> = new ReplaySubject(1);
  username: string;

  constructor(private router: Router, private api: ApiService) {}

  authcheck(){
    this.api.authcheck().subscribe((res: any) => {
      if(res.username){
        this.loggedIn.next(true);
        this.username = res.username;
      } else {
        this.loggedIn.next(false);
      }
    });
  }

  logout() {
    this.api.logout().subscribe((res) => {
      this.loggedIn.next(false);
      this.username = null;
      this.router.navigate(['/login']);
    });
  }
}
