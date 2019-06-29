import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAllAroundScenePageComponent } from './terms-all-around-scene-page.component';

describe('TermsAllAroundScenePageComponent', () => {
  let component: TermsAllAroundScenePageComponent;
  let fixture: ComponentFixture<TermsAllAroundScenePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAllAroundScenePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAllAroundScenePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
