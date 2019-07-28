import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadphonesTestPageComponent } from './headphones-test-page.component';

describe('HeadphonesTestPageComponent', () => {
  let component: HeadphonesTestPageComponent;
  let fixture: ComponentFixture<HeadphonesTestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadphonesTestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadphonesTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
