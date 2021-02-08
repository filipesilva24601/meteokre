import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedIn: boolean = false;
  username: string;

  constructor(private router: Router, private api: ApiService) {}

  authcheck(){
    this.api.authcheck().subscribe((res: any) => {
      if(res.username){
        this.loggedIn = true;
        this.username = res.username;
      }
    });
  }

  logout() {
    this.api.logout().subscribe((res) => {
      this.loggedIn = false;
      this.username = null;
      this.router.navigate(['/login']);
    });
  }
}
