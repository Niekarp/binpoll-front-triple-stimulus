import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatIcon } from '@angular/material';

@Component({
  selector: 'app-play-audio-button',
  templateUrl: './play-audio-button.component.html',
  styleUrls: ['./play-audio-button.component.scss']
})
export class PlayAudioButtonComponent implements OnInit {
  @ViewChild('buttonIcon') buttonIcon: MatIcon;

  @Input()
  public text: string = '';

  @Input()
  public audioId: number = 0;

  @Output()
  public onClick = new EventEmitter();

  @Output()
  public onInit = new EventEmitter();

  public playing: boolean = false;

  constructor() { }

  ngOnInit() {
    this.onInit.emit(this);
  }

  public onButtonClick(): void {
    this.onClick.emit(this);
  }

  public toggle(): void {
    if(this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  public pause(): void {
    this.buttonIcon._elementRef.nativeElement.textContent = 'play_circle_outline';
    this.playing = false;
  }

  public play(): void {
    this.buttonIcon._elementRef.nativeElement.textContent = 'pause';
    this.playing = true;
  }

  public focus(): void {
    document.getElementById('audio-button').focus();
  }

  public blur(): void {
    document.getElementById('audio-button').blur();
  }
}
