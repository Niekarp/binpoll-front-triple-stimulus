import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadphonesTestComponent } from './headphones-test.component';

describe('HeadphonesTestComponent', () => {
  let component: HeadphonesTestComponent;
  let fixture: ComponentFixture<HeadphonesTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadphonesTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadphonesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
