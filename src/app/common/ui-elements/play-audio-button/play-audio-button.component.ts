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
  public text = '';

  @Input()
  public audioId = 0;

  @Output()
  public buttonClick = new EventEmitter();

  @Output()
  public init = new EventEmitter();

  public playing = false;

  ngOnInit() {
    this.init.emit(this);
  }

  public onButtonClick(): void {
    this.buttonClick.emit(this);
  }

  public toggle(): void {
    if (this.playing) {
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
