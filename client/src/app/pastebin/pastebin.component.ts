import { Component, OnInit } from '@angular/core';

declare var ClassicEditor: any;

@Component({
  selector: 'app-pastebin',
  templateUrl: './pastebin.component.html',
  styleUrls: ['./pastebin.component.css']
})
export class PastebinComponent implements OnInit {

  editor;

  constructor() { }

  ngOnInit(): void {
    ClassicEditor
      .create(document.querySelector('#editor')).then(editor => this.editor = editor)
      .catch(error => {
        console.error(error);
      });
    console.log(this.editor);
  }

  showData() {
    console.log(this.editor.getData());
  }

}
