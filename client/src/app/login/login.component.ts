import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private titleService: Title,
    private api: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  username: string;
  password: string;

  message: string = '';

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  login() {
    this.message = null;
    this.api.login(this.username, this.password).subscribe({
      next: (res) => {
        this.userService.loggedIn = true;
        this.userService.username = this.username;
        this.router.navigate(['/pastebin']);
      },
      error: (err) => {
        this.message = err.error.message;
      },
    });
  }
}
