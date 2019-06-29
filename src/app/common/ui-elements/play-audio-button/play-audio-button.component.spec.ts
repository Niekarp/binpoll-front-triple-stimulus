import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAudioButtonComponent } from './play-audio-button.component';

describe('PlayAudioButtonComponent', () => {
  let component: PlayAudioButtonComponent;
  let fixture: ComponentFixture<PlayAudioButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayAudioButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayAudioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
