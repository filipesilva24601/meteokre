import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-imageview',
  templateUrl: './imageview.component.html',
  styleUrls: ['./imageview.component.css'],
})
export class ImageviewComponent implements OnInit {
  image: string;
  encryptionKey: string;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {}

  getImage() {
    const tmp = this.encryptionKey.split('#');
    const ivKey = tmp[0];
    const encKey = tmp[1];
    this.api
      .getFile(this.route.snapshot.paramMap.get('id'), encKey, ivKey)
      .then((ab) => {
        this.image = `data:${ab.fileType};base64,${ab.data}`;
      });
  }
}
