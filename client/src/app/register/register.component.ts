import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private titleService: Title,
    private api: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  username: string;
  password: string;

  message: string;

  ngOnInit(): void {
    this.titleService.setTitle('Register');
  }

  clearMessage() {
    this.message = undefined;
  }

  register() {
    this.clearMessage();
    this.api.register(this.username, this.password).subscribe({next: (res:any) => {
        this.userService.loggedIn.next(true);
        this.userService.username = this.username;
        this.router.navigate(['/pastebin']);
      }, error: (err: HttpErrorResponse) => {
        this.message = err.error.message;
    }});
  }
}
