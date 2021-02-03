import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public constructor(private titleService: Title, public userService: UserService) {}

  ngOnInit() {
    this.setTitle('Meteokre');
    this.userService.authcheck();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
