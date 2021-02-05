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
    this.api.authcheck().subscribe({next: (res: any) => {
      if(res.status == 200){
        this.loggedIn = true;
        this.username = res.body.username;
      }
    }});
  }

  logout() {
    this.api.logout().subscribe((res) => {
      this.loggedIn = false;
      this.username = null;
      this.router.navigate(['/login']);
    });
  }
}
