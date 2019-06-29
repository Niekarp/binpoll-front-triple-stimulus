import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProblemPageComponent } from './report-problem-page.component';

describe('ReportProblemPageComponent', () => {
  let component: ReportProblemPageComponent;
  let fixture: ComponentFixture<ReportProblemPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProblemPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProblemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
