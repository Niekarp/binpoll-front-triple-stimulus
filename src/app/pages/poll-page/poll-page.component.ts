import { Component, OnInit, HostListener, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SharedConfig } from '../../config/shared-config';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FurtherHelpDialogComponent } from '../headphones-test-page/further-help-dialog/further-help-dialog.component';
import { ApiClientService } from '../../services/api-client/api-client.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PlayAudioButtonComponent } from 'src/app/common/ui-elements/play-audio-button/play-audio-button.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data/data.service';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { moveItemInArray, CdkDragDrop, transferArrayItem, CdkDrag, CdkDropList, CdkDragStart, CdkDragRelease } from '@angular/cdk/drag-drop';

import * as $ from 'jquery';

interface TestStatus { done: boolean, problem: null | ProblemName };
enum ProblemName { NotMatched, NotPlayed };

@Component({
  selector: 'app-poll-page',
  templateUrl: './poll-page.component.html',
  styleUrls: ['./poll-page.component.scss']
})
export class PollPageComponent implements OnInit {
  @ViewChildren('audioButtons') audioButtons: QueryList<PlayAudioButtonComponent>;
  @ViewChild('spinnerText') spinnerText: ElementRef;
  
  public audioPool: any[][];
  public fbDropZone: any[][];
  public bfDropZone: any[][];
  public ffDropZone: any[][];
  private wasAudioPlayed: any[][];
  
  private currentDropZoneId: string;
  private dragInitialPositionRect: ClientRect;
  private dragging: boolean = false;
  private draggingContainer: CdkDropList = null;
  private draggingConteinerChanged: boolean = false;
  private isOverNewContainer: boolean = false;
  private stopTheDrop: boolean = false;
  private draggingData: string;
  
  public testCount: number;
  public currentTestIndex: number = 0;
  
  public spinnerLoadingProgress = 0;
  public audioLoadingProgress = 0;
  
  private isFurtherHelpOpen: boolean = false;

  // Specify if more logs should be displayed
  private verboseLog: boolean;
  
  constructor(
      public snackbar: MatSnackBar,
      public dialog: MatDialog,
      public apiClient: ApiClientService,
      public data: DataService,
      public keyboardNav: KeyboardNavigationService,
      private router: Router,
      private spinner: NgxSpinnerService,
      private audio: AudioService,
      private sharedConfig: SharedConfig) {
    this.verboseLog = false;
    this.testCount = sharedConfig.testCount;
    // Load data shared across components
    this.audioPool = this.data.audioPool;
    this.fbDropZone = this.data.fbDropZone;
    this.bfDropZone = this.data.bfDropZone;
    this.ffDropZone = this.data.ffDropZone;
    this.wasAudioPlayed = this.data.wasAudioPlayed;
  }
    
  ngOnInit() {
    if (document.getElementById('move') === null) {
      document.getElementsByTagName('head')[0].appendChild(this.createMoveAnimationStyle());
    }
    
    this.audio.loadAudioPlayers();
    
    if (this.audio.isAllPollAudioLoaded() === false) {
      setTimeout(() => {
        this.spinner.show();
      }, 100);
      
      let spinnerUpdateInterval = setInterval(() => { this.updateSpinner() }, 100);
      
      this.audio.notifyOnAllPollAudioLoaded(() => { 
        this.initPollData();
        clearInterval(spinnerUpdateInterval);
        this.completeSpinnerProgress(() => { this.spinner.hide(); });
        }, () => { 
          this.audioLoadingProgress = this.audio.getPollLoadingProgressPercentage();
        }, () => {
          console.error('loading audio timeout') 
        });
    } else if (this.data.pollDataInitiated === false) {
      this.initPollData();
    }

    this.initKeyboardNavigation();
  }

  // Drag & drop related

  public drop(event: CdkDragDrop<string[]>): void {
    (event.container.element.nativeElement as HTMLElement).style.setProperty('--after-opacity', '0');
    $('.mat-ripple-element').removeAttr('style');
    
    let audios = document.getElementsByClassName('audio-dropped');
    for (let i = 0; i < audios.length; ++i) {
      (audios.item(i) as HTMLElement).classList.remove('no-mouse-transition');
      (audios.item(i) as HTMLElement).classList.remove('move');
    }
    
    if (this.stopTheDrop) {
      this.stopTheDrop = false; 
      if (this.draggingContainer.id === 'audioPool') {
        document.getElementById('audioPool').style.animationName = 'refresh-pool';
      }
      this.dragging = false;
      this.draggingContainer = null;    
      this.draggingConteinerChanged = false;
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // move item: old container -> new container
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      // move item: new container -> old container
      if (event.container.id !== 'audioPool' && event.container.data.length === 2) {
        transferArrayItem(event.container.data,
          event.previousContainer.data,
          event.currentIndex ? 0 : 1,
          event.previousIndex);
      }
    }

    this.dragging = false;
    this.draggingContainer = null;    
    this.draggingConteinerChanged = false;
  }
    
  public onDragStart(event: CdkDragStart): void {
    this.dragging = true;
    this.draggingContainer = event.source.dropContainer;
    this.draggingData = event.source.data.text;
    this.dragInitialPositionRect = event.source.getRootElement().getClientRects().item(0);
    
    document.getElementById('audioPool').style.animationName = '';
  }
  
  public onDragReleased(event: CdkDragRelease): void {
    if (this.draggingConteinerChanged && this.isOverNewContainer === false) {
      // Need custom animation
      let dragPreview = document.getElementsByClassName('cdk-drag-preview').item(0) as HTMLElement;
      
      let style = document.getElementById('move');
      style.innerHTML = '.move { transform: translate3d(' + this.dragInitialPositionRect.left + 'px ,' + this.dragInitialPositionRect.top + 'px, 0px) !important; }';
      
      dragPreview.classList.add('no-mouse-transition');
      dragPreview.classList.add('move');
      
      this.stopTheDrop = true;
    }
    if (this.isOverNewContainer && this.currentDropZoneId !== 'audioPool') {
      let audioAndPlaceholder = document.getElementById(this.currentDropZoneId).children;
      let placeholder = (audioAndPlaceholder.item(1) as HTMLElement);
      
      if (audioAndPlaceholder.length === 2 && placeholder.classList.contains('cdk-drag-placeholder')) {
        // It really is a placeholder
        placeholder.style.top = '-50px';
      }
    }
    
    this.dragging = false;
    this.draggingData = null;
  }
    
  public onMouseEnter(event: MouseEvent): void {
    const dropZoneId = (event.target as HTMLElement).id;
    this.currentDropZoneId = dropZoneId;
    
    if (this.dragging === false) return;
    if (dropZoneId !== 'audioPool') (event.target as HTMLElement).style.setProperty('--after-opacity', '1');
        
    this.draggingConteinerChanged = this.draggingContainer.id !== dropZoneId;
    if (this.draggingConteinerChanged) this.isOverNewContainer = true;
    
    if (this[dropZoneId][this.currentTestIndex].length === 0) return;
    if (this.draggingConteinerChanged === false) return;
    if (dropZoneId === 'audioPool') return;
    
    let audioElement = document.getElementById(dropZoneId).firstElementChild as HTMLElement;
    if (audioElement.classList.contains('cdk-drag-placeholder')) audioElement = audioElement.nextElementSibling as HTMLElement;
    
    const audioRect = (audioElement as Element).getBoundingClientRect();
    
    let style = document.getElementById('move');
    
    let bias = 0;
    if (this.draggingContainer.id === 'audioPool' && this.audioPool[this.currentTestIndex].length === 2) {
      let left = (this.audioPool[this.currentTestIndex].findIndex((value) => { 
        return value.text === this.draggingData;
      })) === 0;
      bias += left ? -1 : 1;
      bias *= 150;   
    }
    
    style.innerHTML = '.move { transform: translate3d(' +
      (this.dragInitialPositionRect.left - audioRect.left + bias) + 'px , ' +
      (this.dragInitialPositionRect.top - audioRect.top) + 'px, 0px) !important; }';
    audioElement.classList.add('no-mouse-transition');
    audioElement.classList.add('move');
  }
    
  public onMouseLeave(event: MouseEvent): void {
    const dropZoneId = (event.target as HTMLElement).id;
    this.currentDropZoneId = null;
    
    (event.target as HTMLElement).style.setProperty('--after-opacity', '0');
    
    if (this.isOverNewContainer) this.isOverNewContainer = false;
    if (this.dragging === false) return;
    if (this[dropZoneId][this.currentTestIndex].length === 0) return;
    if (this.draggingContainer.id === dropZoneId) return;
    if (dropZoneId === 'audioPool') return;
    
    let audioElement = document.getElementById(dropZoneId).firstElementChild as HTMLElement;
    if (audioElement.classList.contains('cdk-drag-placeholder')) { 
      audioElement = audioElement.nextElementSibling as HTMLElement;
    }
    audioElement.classList.remove('move');
  }
  
  public onAudioButtonInit(initedAudio: PlayAudioButtonComponent): void {
    if (this.audio.isPlaying(initedAudio.audioId)) initedAudio.play(); 
  }
    
  public onAudioButtonClick(clickedButton: PlayAudioButtonComponent): void {
    if (this.verboseLog) {
      let allAudioData = this.audioPool[this.currentTestIndex]
      .concat(this.fbDropZone[this.currentTestIndex])
      .concat(this.bfDropZone[this.currentTestIndex])
      .concat(this.ffDropZone[this.currentTestIndex]);
      
      let clickedAudioData = allAudioData.find((audioData) => { return audioData.id === clickedButton.audioId });
      
      if (clickedAudioData === undefined) {
        console.error('cannot find clicked button\'s audio data');
      } else {
        console.log(
            'clicked button\'s audio: ', 
            this.audio.getSamplesName()[this.currentTestIndex],
            clickedAudioData.scene);
      }
    }
    
    this.wasAudioPlayed[this.currentTestIndex][clickedButton.audioId - 1] = true;
    
    this.audioButtons.toArray().forEach((audioButton) => {           
      if(audioButton === clickedButton) {
        if(clickedButton.isPlaying() == true) {
          clickedButton.pause();
          this.audio.pause();
        } else {
          clickedButton.play();
          if(clickedButton.audioId === 1) {
            this.audio.play(this.currentTestIndex, 0);
          } else if(clickedButton.audioId === 2) {
            this.audio.play(this.currentTestIndex, 1);
          } else if(clickedButton.audioId === 3) {
            this.audio.play(this.currentTestIndex, 2);
          } else {
            console.error('invalid audio id');
          }
        }
      } else {
        audioButton.pause();
      }        
    });
  }
      
  public onFurtherHelpClick() {
    this.audio.pause();
    this.audioButtons.toArray().forEach((audioButton) => {
      audioButton.pause();
    });
    const dialogRef = this.dialog.open(FurtherHelpDialogComponent, {
      height: '600px',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.isFurtherHelpOpen = false;
    });
    this.isFurtherHelpOpen = true;
  }
      
  private getAllIndexes(arr, val): any[] {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++) {
      if (arr[i] === val) indexes.push(i);
    }
    return indexes;
  }

  private showProblemMessage(problem: ProblemName): void {
    switch(problem) {
      case ProblemName.NotMatched: {
        this.showMessage('match recordings with acoustic scenes');
        break;
      } case ProblemName.NotPlayed: {
        let notPlayedAudiosIndices = this.getAllIndexes(this.wasAudioPlayed[this.currentTestIndex], false);
        switch(notPlayedAudiosIndices.length) {
          case 1: {
            this.showMessage('audio ' + (notPlayedAudiosIndices[0] + 1) + ' wasn\'t played');
            break;
          } case 2: {
            this.showMessage('audio ' + (notPlayedAudiosIndices[0] + 1) + 
              ' and audio ' + (notPlayedAudiosIndices[1] + 1) + ' weren\'t played');
            break;
          } default: {
            this.showMessage('audio 1, 2 and 3 weren\'t played');
          }
        }
        break;
      }
    }
  }
      
  private showMessage(msg: string): void {
    let $snackbar = this.snackbar.open(msg, null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ['my-snackbar-problem'],
    });
    $snackbar.afterOpened().subscribe(() => {
      ($snackbar as any).containerInstance._elementRef.nativeElement.parentElement.style.pointerEvents = 'none';
    });
  }

  // Init related

  private createMoveAnimationStyle(): HTMLStyleElement {
    let moveAnimationStyle = document.createElement('style');
    moveAnimationStyle.type = 'text/css';
    moveAnimationStyle.id = 'move';
    return moveAnimationStyle;
  }

  // Intended to be called when audio is loaded
  private initPollData() {
    this.initDropZones();
    this.data.startDate = new Date();
    this.data.pollDataInitiated = true;
  }
    
  // Intended to be called when audio is loaded
  private initDropZones(): void {
    let scenes = this.audio.getScenes();
    for(let i = 0; i < this.testCount; ++i) {
      this.audioPool[i] = [
        {text:'audio 1', id:1, scene: scenes[i][0]},
        {text:'audio 2', id:2, scene: scenes[i][1]},
        {text:'audio 3', id:3, scene: scenes[i][2]}
      ];
      this.fbDropZone[i] = [];
      this.bfDropZone[i] = [];
      this.ffDropZone[i] = [];
      this.wasAudioPlayed[i] = [false, false, false];
    }
  }

  private initKeyboardNavigation() {
    this.keyboardNav.activeCondition = () => {
      return this.audio.isAllPollAudioLoaded() && !this.isFurtherHelpOpen;
    };

    this.keyboardNav.goBackCondition = () => { return this.leaveTestCondition; }
    this.keyboardNav.goNextCondition = () => { return this.finishTestCondition; };

    this.keyboardNav.onGoBackConditionFail = () => { this.goToPastTask(); };
    this.keyboardNav.onGoNextConditionFail = () => { this.goToNextTask(); };

    this.keyboardNav.onGoBackConditionOK = () => { this.onLeaveTest(); }
    this.keyboardNav.onGoNextConditionOK = () => { this.onFinishTest(); };
  }

  // Navigation

  public get leaveTestCondition(): boolean {
    return this.currentTestIndex === 0;
  }

  public get finishTestCondition(): boolean {
    return this.currentTestStatus.done && (this.currentTestIndex + 1) === this.testCount
  }

  public goToPastTask(): void {
    this.audio.pause(); 
    this.currentTestIndex -= 1;
  }

  public goToNextTask(): void {
    let currentTestStatus = this.currentTestStatus;
    if (currentTestStatus.done === false) {
      this.showProblemMessage(currentTestStatus.problem);
    } else {
      this.audio.pause();
      this.currentTestIndex += 1;
    }
  }

  public onLeaveTest(): void {
    this.audio.pause(); 
    this.keyboardNav.active = true;
  }

  public onFinishTest(): void {
    this.audio.pause(); 
    this.prepareAndSendPollAnswer();
  }

  // Spinner related
 
  private updateSpinner(): boolean {
    if (this.spinnerLoadingProgress < this.audioLoadingProgress) {
      this.spinnerLoadingProgress += 1;
      this.spinnerText.nativeElement.innerText = 'loading audio' + '(' + this.spinnerLoadingProgress + '%)';
      return true;
    } else { return false; }
  }

  // Intended to call when audio is loaded
  private completeSpinnerProgress(onComplete: () => void): void {
    if (this.spinnerLoadingProgress < 5) {
      // Skip spinner update to 100
      onComplete();
      return;
    }
    let spinnerUpdateInterval = setInterval(() => {
      if (this.updateSpinner() === false) {
        clearInterval(spinnerUpdateInterval);
        onComplete();
      }
    }, 50);
  }

  // When test is completed

  private prepareAndSendPollAnswer() {
    let sampleNames = this.audio.getSamplesName();
    let answer = {};
    for (let i = 0; i < 10; ++i) {
      answer[sampleNames[i]] = {
        'answer_FB': this.fbDropZone[i][0].scene,
        'answer_BF': this.bfDropZone[i][0].scene,
        'answer_FF': this.ffDropZone[i][0].scene
      };
    }
    
    this.apiClient.sendPollData({
      startDate: this.data.startDate,
      endDate: new Date(),
      answer: answer,
      assignedSetId: this.audio.pollAudioSet.id,
      userInfo: {
        age: this.data.questionnaire.age,
        hearing_difficulties: this.data.questionnaire.hearingDifficulties,
        headphones_make_and_model: this.data.questionnaire.typedHeadphonesMakeAndModel,
        listening_test_participated: this.data.questionnaire.listeningTestParticipation
      }
    });
  }

  // Other

  private get currentTestStatus(): TestStatus {
    if (this.fbDropZone[this.currentTestIndex].length === 0 || 
        this.bfDropZone[this.currentTestIndex].length === 0 || 
        this.ffDropZone[this.currentTestIndex].length === 0) {
      return {
        done: false,
        problem: ProblemName.NotMatched
      };
    } else if (this.wasAudioPlayed[this.currentTestIndex].includes(false)) {
      return {
        done: false,
        problem: ProblemName.NotPlayed
      };
    } else {
      return {
        done: true,
        problem: null
      };
    }
  }
}
        