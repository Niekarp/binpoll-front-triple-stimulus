import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcousticScenesPageComponent } from './acoustic-scenes-page.component';

describe('AcousticScenesPageComponent', () => {
  let component: AcousticScenesPageComponent;
  let fixture: ComponentFixture<AcousticScenesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcousticScenesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcousticScenesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
