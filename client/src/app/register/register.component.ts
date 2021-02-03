import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    private userService: UserService
  ) {}

  username: string;
  password: string;

  ngOnInit(): void {
    this.titleService.setTitle('Register');
  }

  register() {
    this.api.register(this.username, this.password).subscribe((res) => {
      this.userService.loggedIn = true;
      this.userService.username = this.username;
    });
  }
}
