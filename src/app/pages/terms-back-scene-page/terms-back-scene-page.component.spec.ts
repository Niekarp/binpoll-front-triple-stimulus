import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsBackScenePageComponent } from './terms-back-scene-page.component';

describe('TermsBackScenePageComponent', () => {
  let component: TermsBackScenePageComponent;
  let fixture: ComponentFixture<TermsBackScenePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsBackScenePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsBackScenePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
