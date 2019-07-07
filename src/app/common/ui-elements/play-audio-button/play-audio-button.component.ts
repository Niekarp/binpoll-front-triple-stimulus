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
  public audioId = '';

  @Output()
  public onClick = new EventEmitter();

  constructor() { console.log('audio button created'); }

  ngOnInit() {
  }

  public onButtonClick() {
    this.onClick.emit(this.audioId);
  }

  public toggle() {
    let currentIcon = this.buttonIcon._elementRef.nativeElement.textContent;

    if (currentIcon === 'play_circle_outline') 
      this.buttonIcon._elementRef.nativeElement.textContent = 'pause';
    else
      this.buttonIcon._elementRef.nativeElement.textContent = 'play_circle_outline'
  }

  public pause() {
    this.buttonIcon._elementRef.nativeElement.textContent = 'play_circle_outline';
  }

  public blur() {
    document.getElementById('audio-button').blur();
  }
}
