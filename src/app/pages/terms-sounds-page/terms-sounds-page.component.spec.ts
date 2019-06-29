import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsSoundsPageComponent } from './terms-sounds-page.component';

describe('TermsSoundsPageComponent', () => {
  let component: TermsSoundsPageComponent;
  let fixture: ComponentFixture<TermsSoundsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsSoundsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsSoundsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
