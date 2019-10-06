import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSetsComponent } from './audio-sets.component';

describe('AudioSetsComponent', () => {
  let component: AudioSetsComponent;
  let fixture: ComponentFixture<AudioSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
