import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserFilesComponent } from './view-user-files.component';

describe('ViewUserFilesComponent', () => {
  let component: ViewUserFilesComponent;
  let fixture: ComponentFixture<ViewUserFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
