import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FurtherHelpDialogComponent } from '../../common/ui-elements/further-help-dialog/further-help-dialog.component';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PlayAudioButtonComponent } from 'src/app/common/ui-elements/play-audio-button/play-audio-button.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-headphones-test-page',
  templateUrl: './headphones-test-page.component.html',
  styleUrls: ['./headphones-test-page.component.scss']
})
export class HeadphonesTestPageComponent implements OnInit {
  @ViewChild('leftAudioButton')  leftAudioButton: PlayAudioButtonComponent;
  @ViewChild('rightAudioButton') rightAudioButton: PlayAudioButtonComponent;
  @ViewChild('spinnerText') spinnerText: ElementRef;

  constructor(
      private dialog: MatDialog,
      private audio: AudioService,
      private spinner: NgxSpinnerService,
      private keyboardNav: KeyboardNavigationService) {
  }

  ngOnInit(): void {
    this.keyboardNav.goBackCondition = (): boolean => this.audio.isAllTestAudioLoaded();
    this.keyboardNav.goNextCondition = (): boolean => this.audio.isAllTestAudioLoaded();
    this.keyboardNav.onGoNextConditionOK = (): void => this.audio.pauseHeadphonesTestAudio();
    this.keyboardNav.onGoBackConditionOK = (): void => this.audio.pauseHeadphonesTestAudio();

    this.audio.loadAudioPlayers();

    if (!this.audio.isAllTestAudioLoaded()) {
      setTimeout(() => {
        this.spinner.show();
      }, 100);

      this.audio.notifyOnAllTestAudioLoaded(() => {
        this.spinner.hide();
      }, () => {
        this.spinnerText.nativeElement.innerText = 'loading audio' +
          '(' + this.audio.getTestLoadingProgressPercentage() + '%)';
      }, () => {
        console.error('loading audio timeout');
      });
    }

    this.audio.headphonesTestLeftChannelAudio.onended = (): void => this.leftAudioButton.toggle();
    this.audio.headphonesTestRightChannelAudio.onended = (): void => this.rightAudioButton.toggle();
  }

  public onLeftAudioButtonClick(): void {
    if (!this.audio.headphonesTestRightChannelAudio.paused) {
      this.toggleRightAudioButtonAndAudio();
    }
    this.toggleLeftAudioButtonAndAudio();
  }

  public onRightAudioButtonClick(): void {
    if (!this.audio.headphonesTestLeftChannelAudio.paused) {
      this.toggleLeftAudioButtonAndAudio();
    }
    this.toggleRightAudioButtonAndAudio();
  }

  public toggleLeftAudioButtonAndAudio(): void {
    this.leftAudioButton.toggle();
    this.audio.toggleHeadphonesTestLeftChannelAudio();
  }

  public toggleRightAudioButtonAndAudio(): void {
    this.rightAudioButton.toggle();
    this.audio.toggleHeadphonesTestRightChannelAudio();
  }

  public onFurtherHelpClick(): void {
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

  public onNavigationButtonSuccess(): void {
    this.stopAudio();
  }

  public stopAudio(): void {
    this.audio.pauseHeadphonesTestAudio();
  }
}
