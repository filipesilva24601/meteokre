import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  files$ = this.api.getFiles();

  deleteClicks: number = 0;

  deleteMessages: string[] = [
    'Delete Account',
    'All files will be deleted',
    'Are you sure?',
    'Last chance',
    'Goodbye',
  ];

  constructor(
    private api: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  delete(id) {
    this.api.delete(id).subscribe((res: any) => {
      this.files$ = this.api.getFiles();
    });
  }

  deleteAccount() {
    if (this.deleteClicks > 3) {
      return;
    }
    if (this.deleteClicks === 3) {
      this.api.deleteAccount().subscribe((res) => {
        this.userService.logout();
      });
    }
    this.deleteClicks += 1;
  }
}
