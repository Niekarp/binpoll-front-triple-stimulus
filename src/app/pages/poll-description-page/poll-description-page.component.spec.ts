import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollDescriptionPageComponent } from './poll-description-page.component';

describe('PollDescriptionPageComponent', () => {
  let component: PollDescriptionPageComponent;
  let fixture: ComponentFixture<PollDescriptionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollDescriptionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollDescriptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
