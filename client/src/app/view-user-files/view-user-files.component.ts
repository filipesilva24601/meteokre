import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-view-user-files',
  templateUrl: './view-user-files.component.html',
  styleUrls: ['./view-user-files.component.css'],
})
export class ViewUserFilesComponent implements OnInit {
  files = this.api.getFiles();

  constructor(private api: ApiService) {}

  ngOnInit(): void {}
}
