import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FurtherHelpDialogComponent } from './further-help-dialog/further-help-dialog.component';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PlayAudioButtonComponent } from 'src/app/common/ui-elements/play-audio-button/play-audio-button.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-headphones-test',
  templateUrl: './headphones-test.component.html',
  styleUrls: ['./headphones-test.component.scss']
})
export class HeadphonesTestComponent implements OnInit {

  @ViewChild('leftAudioButton')  leftAudioButton:  PlayAudioButtonComponent;
  @ViewChild('rightAudioButton') rightAudioButton: PlayAudioButtonComponent;
  @ViewChild('spinnerText') spinnerText: ElementRef;

  constructor(private dialog: MatDialog,
              private audio: AudioService,
              private spinner: NgxSpinnerService,
              public keyboardNav: KeyboardNavigationService) { }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return this.audio.isAllTestAudioLoaded(); };
    this.keyboardNav.goNextCondition = () => { return this.audio.isAllTestAudioLoaded(); };
    this.keyboardNav.onGoNextConditionOK = () => { this.audio.pauseHeadphonesTestAudio(); };
    this.keyboardNav.onGoBackConditionOK = () => { this.audio.pauseHeadphonesTestAudio(); };
    this.keyboardNav.deactivateOnNext = true;

    this.audio.loadAudioPlayers();

    if (this.audio.isAllTestAudioLoaded() === false) {
      setTimeout(() => {
        this.spinner.show();
      }, 100);

      this.audio.notifyOnAllTestAudioLoaded(() => { 
        console.log('audio loaded'); 
        this.spinner.hide();
      }, () => { 
        this.spinnerText.nativeElement.innerText = 'loading audio' 
                                                    + '(' + this.audio.getTestLoadingProgressPercentage() + '%)';
      }, () => {
        console.error('loading audio timeout') 
      });
    }

    this.audio.headphonesTestLeftChannelAudio.onended = () => {
      console.log('left audio stopped');
      this.leftAudioButton.toggle();
    }
    this.audio.headphonesTestRightChannelAudio.onended = () => {
      this.rightAudioButton.toggle();
    }
  }

  public onLeftAudioButtonClick() {
    if (this.audio.headphonesTestRightChannelAudio.paused === false) this.toggleRightAudioButtonAndAudio();
    this.toggleLeftAudioButtonAndAudio();
  }

  public onRightAudioButtonClick() {
    if (this.audio.headphonesTestLeftChannelAudio.paused === false) this.toggleLeftAudioButtonAndAudio();
    this.toggleRightAudioButtonAndAudio();
  }

  public toggleLeftAudioButtonAndAudio() {
    this.leftAudioButton.toggle();
    this.audio.toggleHeadphonesTestLeftChannelAudio();
  }

  public toggleRightAudioButtonAndAudio() {
    this.rightAudioButton.toggle();
    this.audio.toggleHeadphonesTestRightChannelAudio();
  }

  public onFurtherHelpClick() {
    this.audio.pauseHeadphonesTestAudio();
    this.leftAudioButton.pause();
    this.rightAudioButton.pause();
    this.keyboardNav.active = false;

    const dialogRef = this.dialog.open(FurtherHelpDialogComponent, {
      height: '600px',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.keyboardNav.active = true;
    });
  }

  onNavigationButtonSuccess() {
    this.keyboardNav.active = false;
    this.stopAudio();
  }

  stopAudio() {
    this.audio.pauseHeadphonesTestAudio();
  }
}
