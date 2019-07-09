import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollExamplePageComponent } from './poll-example-page.component';

describe('PollExamplePageComponent', () => {
  let component: PollExamplePageComponent;
  let fixture: ComponentFixture<PollExamplePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollExamplePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollExamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
