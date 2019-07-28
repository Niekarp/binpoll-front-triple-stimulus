import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FurtherHelpDialogComponent } from './further-help-dialog.component';

describe('FurtherHelpDialogComponent', () => {
  let component: FurtherHelpDialogComponent;
  let fixture: ComponentFixture<FurtherHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FurtherHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FurtherHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
