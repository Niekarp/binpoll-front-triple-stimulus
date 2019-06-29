import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsFrontScenePageComponent } from './terms-front-scene-page.component';

describe('TermsFrontScenePageComponent', () => {
  let component: TermsFrontScenePageComponent;
  let fixture: ComponentFixture<TermsFrontScenePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsFrontScenePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsFrontScenePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
