import { Component, OnInit, HostListener, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
    selector: 'app-poll-page',
    templateUrl: './poll-page.component.html',
    styleUrls: ['./poll-page.component.scss']
})
export class PollPageComponent implements OnInit {
    
    @ViewChildren('audioButtons') audioButtons: QueryList<PlayAudioButtonComponent>;
    @ViewChild('spinnerText') spinnerText: ElementRef;
    
    public audioPool = [];
    public fbDropZone = [];
    public bfDropZone = [];
    public ffDropZone = [];
    
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

    private wasAudioPlayed = Array<boolean[]>(10);

    private startDate: Date;

    // specify if activity logs should be displayed
    private verboseLog: boolean;
    
    constructor(public snackbar: MatSnackBar,
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
        this.startDate = new Date();
     }
    
    ngOnInit() {
        var style = document.createElement('style');
        style.id = 'move';
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);

        this.audio.loadAudioPlayers();

        if (this.audio.isAllPollAudioLoaded() === false) {
            setTimeout(() => {
                this.spinner.show();
            }, 100);
            
            this.audio.notifyOnAllPollAudioLoaded(() => { 
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

                this.spinner.hide();
            }, () => { 
                this.spinnerText.nativeElement.innerText = 'loading audio' + ' (' + this.audio.getPollLoadingProgressPercentage() + '%)';
            }, () => {
                console.error('loading audio timeout') 
            });
        }
        else {
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
    }
    
    drop(event: CdkDragDrop<string[]>) {
        
        (event.container.element.nativeElement as HTMLElement).parentElement.style.boxShadow = null

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
        }

        this.dragging = false;
        this.draggingContainer = null;    
        this.draggingConteinerChanged = false;
    }
            
    onDragStart(event: CdkDragStart) {
        this.dragging = true;
        this.draggingContainer = event.source.dropContainer;
        this.draggingData = event.source.data.text;
        this.dragInitialPositionRect = event.source.getRootElement().getClientRects().item(0);

        document.getElementById('audioPool').style.animationName = '';
    }
    
    onDragReleased(event: CdkDragRelease) {
        if (this.draggingConteinerChanged && this.isOverNewContainer === false) {
            // need custom animation
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
                // it really is a placeholder
                placeholder.style.top = '-50px';
            }
        }

        this.dragging = false;
        this.draggingData = null;
    }
    
    onMouseEnter(event: MouseEvent) {
        const dropZoneId = (event.target as HTMLElement).id;
        this.currentDropZoneId = dropZoneId;
        
        if (this.dragging === false) return;
        if (dropZoneId !== 'audioPool') (event.target as HTMLElement).parentElement.style.boxShadow = '5px 10px 18px #888888';
        
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

        style.innerHTML = '.move { transform: translate3d(' + (this.dragInitialPositionRect.left - audioRect.left + bias) + 'px , ' + (this.dragInitialPositionRect.top - audioRect.top) + 'px, 0px) !important; }';
        audioElement.classList.add('no-mouse-transition');
        audioElement.classList.add('move');
    }
    
    onMouseLeave(event: MouseEvent) {        
        const dropZoneId = (event.target as HTMLElement).id;
        this.currentDropZoneId = null;

        (event.target as HTMLElement).parentElement.style.boxShadow = null
        
        if (this.isOverNewContainer) this.isOverNewContainer = false;
        
        if (this.dragging === false) return;
        if (this[dropZoneId][this.currentTestIndex].length === 0) return;
        if (this.draggingContainer.id === dropZoneId) return;
        if (dropZoneId === 'audioPool') return;
        
        let audioElement = document.getElementById(dropZoneId).firstElementChild as HTMLElement;
        if (audioElement.classList.contains('cdk-drag-placeholder')) audioElement = audioElement.nextElementSibling as HTMLElement;
        audioElement.classList.remove('move');
    }

    public onAudioButtonInit(initedAudio: PlayAudioButtonComponent) {
        if (this.audio.isPlaying(initedAudio.audioId)) initedAudio.play(); 
    }

    public onAudioButtonClick(clickedButton: PlayAudioButtonComponent) {
        if (this.verboseLog) {
            let allAudioData = this.audioPool[this.currentTestIndex]
                .concat(this.fbDropZone[this.currentTestIndex])
                .concat(this.bfDropZone[this.currentTestIndex])
                .concat(this.ffDropZone[this.currentTestIndex]);
            
            let clickedAudioData = allAudioData.find((audioData) => { return audioData.id === clickedButton.audioId });
            
            if (clickedAudioData === undefined) {
                console.error('cannot find clicked button\'s audio data');
            }
            else {
                console.log('clicked button\'s audio: ', this.audio.getSamplesName()[this.currentTestIndex], clickedAudioData.scene);
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

    public goToNextTest() {
        if (this.fbDropZone[this.currentTestIndex].length === 0 || 
            this.bfDropZone[this.currentTestIndex].length === 0 || 
            this.ffDropZone[this.currentTestIndex].length === 0)
        {
            this.showMessage('match recordings with acoustic scenes');
            return;
        }
        else if (this.wasAudioPlayed[this.currentTestIndex].includes(false)) {
            let notPlayedAudiosIndices = this.getAllIndexes(this.wasAudioPlayed[this.currentTestIndex], false);
            if (notPlayedAudiosIndices.length === 1) {
                this.showMessage('audio ' + (notPlayedAudiosIndices[0] + 1) + ' wasn\'t played');
            }
            else if (notPlayedAudiosIndices.length === 2) {
                this.showMessage('audio ' + (notPlayedAudiosIndices[0] + 1) + ' and audio ' + (notPlayedAudiosIndices[1] + 1) + ' weren\'t played');
            }
            else {
                this.showMessage('audio 1, 2 and 3 weren\'t played');
            }
            return;
        }
        
        this.audio.pause();
        this.currentTestIndex += 1;
        
        if (this.currentTestIndex === this.testCount) {
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
        } 
    }
    
    public goToPreviousTest(): void {
        this.audio.pause();
        this.currentTestIndex -= 1;
        
        if (this.currentTestIndex === -1) {
            this.keyboardNav.active = true;
            this.router.navigateByUrl('headphones-test', { skipLocationChange: true });
        } 
    }
    
    public onFurtherHelpClick() {
        const dialogRef = this.dialog.open(FurtherHelpDialogComponent, {
            height: '600px',
            width: '400px',
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }
    
    private getAllIndexes(arr, val) {
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }
    
    private showMessage(msg: string) {
        let $snackbar = this.snackbar.open(msg, null, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ['my-snackbar-problem'],
        });
        $snackbar.afterOpened().subscribe(() => {
            ($snackbar as any).containerInstance._elementRef.nativeElement.parentElement.style.pointerEvents = 'none';
        });
    }
}
