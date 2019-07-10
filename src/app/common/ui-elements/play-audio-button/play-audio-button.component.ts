import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { MatIcon } from '@angular/material';

@Component({
  selector: 'app-play-audio-button',
  templateUrl: './play-audio-button.component.html',
  styleUrls: ['./play-audio-button.component.scss']
})
export class PlayAudioButtonComponent implements OnInit {

  @ViewChild('buttonIcon') buttonIcon: MatIcon;

  @Input()
  public text = '';

  @Input()
  public audioId = 0;

  @Output()
  public onClick = new EventEmitter();

  @Output()
  public onInit = new EventEmitter();

  private playState: boolean = false;

  constructor() { console.log('audio button created'); }

  ngOnInit() {
    this.onInit.emit(this);
  }

  public onButtonClick() {
    this.onClick.emit(this);
  }

  public toggle() {
    if(this.playState) {
      this.pause();
    } else {
      this.play();
    }
  }

  public pause() {
    this.buttonIcon._elementRef.nativeElement.textContent = 'play_circle_outline';
    this.playState = false;
  }

  public play() {
    this.buttonIcon._elementRef.nativeElement.textContent = 'pause';
    this.playState = true;
  }

  public isPlaying(): boolean {
    return this.playState;
  }

  public blur() {
    document.getElementById('audio-button').blur();
  }
}
