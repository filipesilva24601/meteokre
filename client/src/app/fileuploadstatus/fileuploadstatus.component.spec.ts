import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadstatusComponent } from './fileuploadstatus.component';

describe('FileuploadstatusComponent', () => {
  let component: FileuploadstatusComponent;
  let fixture: ComponentFixture<FileuploadstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileuploadstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileuploadstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
