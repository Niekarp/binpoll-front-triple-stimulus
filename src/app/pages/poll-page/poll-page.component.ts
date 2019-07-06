import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedConfig } from '../../config/shared-config';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FurtherHelpDialogComponent } from '../headphones-test/further-help-dialog/further-help-dialog.component';
import { ApiClientService } from '../../services/api-client/api-client.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PlayAudioButtonComponent } from 'src/app/common/ui-elements/play-audio-button/play-audio-button.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data/data.service';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { moveItemInArray, CdkDragDrop, transferArrayItem, CdkDrag, CdkDropList, CdkDragStart, CdkDragRelease } from '@angular/cdk/drag-drop';

import * as $ from 'jquery';

@Component({
    selector: 'app-poll-page',
    templateUrl: './poll-page.component.html',
    styleUrls: ['./poll-page.component.scss']
})
export class PollPageComponent implements OnInit {
    
    // @ViewChild('audioButton') audioButton: PlayAudioButtonComponent;
    // @ViewChild('audioButton') audioButton: PlayAudioButtonComponent;
    // @ViewChild('audioButton') audioButton: PlayAudioButtonComponent;
    @ViewChild('fb') fbDropZoneElement: CdkDropList;
    
    audioPool = [
        'audio 1',
        'audio 2',
        'audio 3'
    ];
    fbDropZone = [];
    bfDropZone = [];
    ffDropZone = [];
    
    dragInitialPositionRect: ClientRect;
    dragging: boolean = false;
    draggingContainer: CdkDropList = null;
    draggingConteinerChanged: boolean = false;
    isOverNewContainer: boolean = false;
    stopTheDrop: boolean = false;
    
    constructor() { }
    
    ngOnInit() {
        var style = document.createElement('style');
        style.id = 'move';
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    drop(event: CdkDragDrop<string[]>) {

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
        } 
        else {
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
                    
                // let swapPredicate = event.container.id === 'audio-toggle-button-pool' 
                //                 ||  event.container.data.length === 1;
        }

        this.dragging = false;
        this.draggingContainer = null;    
        this.draggingConteinerChanged = false;
    }
            
    onDragStart(event: CdkDragStart) {
        console.log('drag started');
        
        this.dragging = true;
        this.draggingContainer = event.source.dropContainer;
        
        this.dragInitialPositionRect = event.source.getRootElement().getClientRects().item(0);
        document.getElementById('audioPool').style.animationName = '';
        // let placeholder = event.source.getRootElement().getClientRects().item(0);
        // let placeholderRect = placeholder.getClientRects();
    }
    
    onDragReleased(event: CdkDragRelease) {
        console.log('drag released');
        
        if (this.draggingConteinerChanged && this.isOverNewContainer === false) {
            
            console.log('need my own animation');
            
            let dragPreview = document.getElementsByClassName('cdk-drag-preview').item(0) as HTMLElement;
            const audioRect = (dragPreview as Element).getBoundingClientRect();
            const containerRect = document.getElementById(this.draggingContainer.id).getBoundingClientRect();
            
            // debugger
            let style = document.getElementById('move');
            style.innerHTML = '.move { transform: translate3d(' + this.dragInitialPositionRect.left + 'px ,' + this.dragInitialPositionRect.top + 'px, 0px) !important; }';
            
            dragPreview.classList.add('no-mouse-transition');
            dragPreview.classList.add('move');
            
            this.stopTheDrop = true;
            // this.fbDropZoneElement.drop(event.source, 0, event.source.dropContainer, false); 
        }
    }
    
    onMouseEnter(event: MouseEvent) {
        console.log('mouse enter event');
        
        const dropZoneId = (event.target as HTMLElement).id;
        
        if (this.dragging === false)       return;
        console.log('mouse enter: ', dropZoneId);
        
        this.draggingConteinerChanged = this.draggingContainer.id !== dropZoneId;
        if (this.draggingConteinerChanged) this.isOverNewContainer = true;
        
        if (this[dropZoneId].length === 0) return;
        if (this.draggingConteinerChanged === false) return;
        if (dropZoneId === 'audioPool') return;

        let audioElement = document.getElementById(dropZoneId).firstElementChild as HTMLElement;
        if (audioElement.classList.contains('cdk-drag-placeholder')) audioElement = audioElement.nextElementSibling as HTMLElement;
        
        const audioRect = (audioElement as Element).getBoundingClientRect();
        const containerRect = document.getElementById(this.draggingContainer.id).getBoundingClientRect();
        
        let style = document.getElementById('move');

        // style.innerHTML = '.move { transform: translate3d(' + (containerRect.left - audioRect.left) + 'px , 0px, 0px) !important; }';
        style.innerHTML = '.move { transform: translate3d(' + (this.dragInitialPositionRect.left - audioRect.left) + 'px , ' + (this.dragInitialPositionRect.top - audioRect.top) + 'px, 0px) !important; }';
        
        audioElement.classList.add('no-mouse-transition');
        audioElement.classList.add('move');
        
        // audioElement.classList.add('no-transform');
        // audioElement.style.left = containerRect.left - audioRect.left + 'px';
    }
    
    onMouseLeave(event: MouseEvent) {
        console.log('mouse leave event');
        
        const dropZoneId = (event.target as HTMLElement).id;
        
        if (this.isOverNewContainer) this.isOverNewContainer = false;
        
        if (this.dragging === false)       return;
        if (this[dropZoneId].length === 0) return;
        if (this.draggingContainer.id === dropZoneId) return;
        if (dropZoneId === 'audioPool') return;
        
        let audioElement = document.getElementById(dropZoneId).lastElementChild as HTMLElement;
        if (audioElement.classList.contains('cdk-drag-placeholder')) audioElement = audioElement.nextElementSibling as HTMLElement;
        
        // audioElement.classList.remove('no-mouse-transition');
        audioElement.classList.remove('move');
        // audioElement.style.left = '0';
        // audioElement.classList.remove('no-transform');
    }
    
    emptyPredicate(item: CdkDrag<number>, drop: CdkDropList) {
        // if (drop._draggables.length > 0) return false;
        return true;
        // new Draggabl
    }
}

// dragPreview.classList.add('no-mouse-transition');
            // dragPreview.classList.add('move');
            
            // document.getElementById('someElementId').className = 'cssClass';
            // let stylesheets = document.styleSheets as any;
            // let s = stylesheets[4] as CSSStyleSheet;
            // s.addRule(".test", 'transform: translate3d(' + containerRect.left + 'px ,' + containerRect.top + 'px, 0px) !important', 1);
            // let css = s.cssRules[24]
            // css.style.width = '500px';
            // const translation = dragPreview.style.transform;
            // dragPreview.style.transform = 'translateZ(0)';
            // dragPreview.style.left = '0px'; 
            // dragPreview.style.top = '0px';
            // dragPreview.style.setProperty("transform", "translate3d(200px, 200px, 0px)", "important");
            
            // this.setStyleRule('.no-transform', 'transform: translate3d(200px, 200px, 0px) important;', 'poll-page.component');
            // this.addRule('poll-page.component', 'no-transform', 'transform: translate3d(200px, 200px, 0px) important;');
            // dragPreview.style.transform = 'translate3d(200px, 200px, 0px)';
            
            // dragPreview.style.left = containerRect.left + 'px';
            // dragPreview.style.top = containerRect.top + 'px';
            
            // $(dragPreview).off();
            
            /* dragPreview.style.left = '0px';
            dragPreview.style.top = '0px'; */
            // dragPreview.style.transition = 'transform3d(400px, 400px, 0px)';

        /* 
        export class PollPageComponent implements OnInit {
            
            @ViewChild('audioButton') audioButton: PlayAudioButtonComponent;
            @ViewChild('spinnerText') spinnerText: ElementRef;
            
            public testCount: number;
            public currentTestIndex: number = 0;
            private selectedScene: string = null;
            private answers: string[] = new Array(this.testCount);
            private selectedAudio: string[] = new Array(this.testCount);
            private wasAudioPlayed = false;
            private startDate: Date;
            private enableKeyboard = true;
            
            constructor(public sharedConfig: SharedConfig, 
                public snackbar: MatSnackBar,
                public dialog: MatDialog,
                public apiClient: ApiClientService,
                public audio: AudioService,
                public data: DataService,
                public keyboardNav: KeyboardNavigationService,
                private router: Router,
                private spinner: NgxSpinnerService) {
                    this.testCount = sharedConfig.testCount;
                    
                    console.log('start poll');
                    this.startDate = new Date();
                }
                
                ngOnInit() {
                    for(let i = 0; i < this.testCount; ++i) {
                        this.answers[i] = 'none';
                    }
                    this.audio.loadAudioPlayers();
                    
                    if (this.audio.isAllPollAudioLoaded() === false) {
                        setTimeout(() => {
                            this.spinner.show();
                        }, 100);
                        
                        this.audio.notifyOnAllPollAudioLoaded(() => { 
                            console.log('audio loaded'); 
                            this.spinner.hide();
                        }, () => { 
                            this.spinnerText.nativeElement.innerText = 'loading audio' 
                            + ' (' + this.audio.getPollLoadingProgressPercentage() + '%)';
                        }, () => {
                            console.error('loading audio timeout') 
                        });
                    }
                }
                
                public onAudioButtonClick() {
                    this.audioButton.toggle();
                    this.audio.togglePollAudio(this.currentTestIndex);
                    this.wasAudioPlayed = true;
                }
                
                public selectScene(selectedSceneButton: HTMLElement): void {
                    this.unselectScenes();
                    
                    selectedSceneButton.getElementsByTagName('img').item(0).classList.remove('grayscale');
                    selectedSceneButton.getElementsByTagName('img').item(0).classList.add('selected-border');
                    
                    this.selectedScene = selectedSceneButton.id;
                    this.answers[this.currentTestIndex] = this.selectedScene;
                }
                
                public unselectScenes() {
                    let selectSceneButtons = document.getElementsByClassName('scene-select-button');
                    for (let i = 0; i < selectSceneButtons.length; ++i) {
                        selectSceneButtons.item(i).getElementsByTagName('img').item(0).classList.add('grayscale');
                        selectSceneButtons.item(i).getElementsByTagName('img').item(0).classList.remove('selected-border');
                    }
                }
                
                public goToNextTest() {
                    if (this.answers[this.currentTestIndex] === 'none') {
                        this.showMessage('select acoustic scene');
                        return;
                    }
                    else if (this.wasAudioPlayed === false) {
                        this.showMessage('audio wasn\'t played');
                        return;
                    }
                    
                    let isAudioPlaying = !this.audio.getPollAudio(this.currentTestIndex).paused;
                    
                    this.unselectScenes();
                    this.audio.pauseAllPollAudio();
                    this.currentTestIndex += 1;
                    
                    if (this.currentTestIndex === this.testCount) {
                        // save results 
                        let answer = {};
                        this.audio.pollAudioSet.samples.forEach((sampleUrl, index) => { 
                            let sampleFilename = sampleUrl.split('/').reverse()[0];
                            answer[sampleFilename] = this.answers[index];
                        });
                        
                        this.apiClient.sendPollData({
                            startDate: this.startDate,
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
                        this.router.navigateByUrl('finish', { skipLocationChange: true });
                        return;
                    } 
                    else {
                        if(isAudioPlaying) {
                            this.audio.playPollAudio(this.currentTestIndex);
                        }
                    }
                    
                    if (this.answers[this.currentTestIndex] !== 'none') {
                        this.selectScene(document.getElementById(this.answers[this.currentTestIndex]));
                        this.wasAudioPlayed = true;
                    }
                    else if (this.audio.getPollAudio(this.currentTestIndex).paused === false) {
                        this.wasAudioPlayed = true;
                    }
                    else {
                        this.wasAudioPlayed = false;
                    }
                }
                
                public goToPreviousTest(): void {
                    let isAudioPlaying = !this.audio.getPollAudio(this.currentTestIndex).paused;
                    
                    this.unselectScenes();
                    this.audio.pauseAllPollAudio();
                    this.currentTestIndex -= 1;
                    
                    if (this.currentTestIndex === -1) {
                        this.keyboardNav.active = true;
                        this.router.navigateByUrl('headphones-test', { skipLocationChange: true });
                        return;
                    } 
                    else {
                        if(isAudioPlaying) {
                            this.audio.playPollAudio(this.currentTestIndex);
                        }
                    }
                    
                    if (this.answers[this.currentTestIndex] !== 'none') {
                        this.selectScene(document.getElementById(this.answers[this.currentTestIndex]));
                        this.wasAudioPlayed = true;
                    }
                }
                
                public onFurtherHelpClick() {
                    this.turnOffTheAudio();
                    this.enableKeyboard = false;
                    const dialogRef = this.dialog.open(FurtherHelpDialogComponent, {
                        height: '600px',
                        width: '400px',
                    });
                    dialogRef.afterClosed().subscribe(() => {
                        this.enableKeyboard = true;
                    });
                }
                
                private turnOffTheAudio() {
                    this.audioButton.pause();
                    this.audio.pauseAllPollAudio();
                }
                
                private showMessage(msg: string) {
                    this.snackbar.open(msg, null, {
                        duration: 2000,
                        verticalPosition: "top",
                        panelClass: ['my-snackbar-problem'],
                    });
                }
                
                @HostListener('window:keydown', ['$event'])
                onKeyDown(event: KeyboardEvent) {
                    // console.log('poll key');
                    if (this.enableKeyboard === false) return;
                    if (this.audio.isAllPollAudioLoaded() === false) return;
                    // console.log('poll key active');
                    
                    if (event.key === 'ArrowLeft') {
                        this.goToPreviousTest();
                    }
                    else if (event.key === 'ArrowRight') {
                        this.goToNextTest();
                    }
                    else if (event.key === ' ') {
                        this.audioButton.blur();
                        
                        for (let i = 0; i < document.getElementsByClassName('scene-select-button').length; ++i) {
                            (document.getElementsByClassName('scene-select-button').item(i) as HTMLElement).blur();
                        }
                        
                        this.onAudioButtonClick();
                    }
                }
            }
            */
            