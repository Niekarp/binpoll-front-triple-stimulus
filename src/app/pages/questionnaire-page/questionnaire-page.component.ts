import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatSelect } from '@angular/material';
import { Router } from '@angular/router';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Questionnaire } from 'src/app/models/questionnaire';
import { DataService } from 'src/app/services/data/data.service';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

export interface Age {
  value: String,
  viewValue: String
}

@Component({
  selector: 'app-questionnaire-page',
  templateUrl: './questionnaire-page.component.html',
  styleUrls: ['./questionnaire-page.component.scss']
})
export class QuestionnairePageComponent implements OnInit {

  public model: Questionnaire;

  public ages: Age[] = [
    { value: 'Under 18', viewValue: 'Under 18' },
    { value: '18-24', viewValue: '18-24' },
    { value: '25-34', viewValue: '25-34' },
    { value: '35-44', viewValue: '35-44' },
    { value: '45-54', viewValue: '45-54' },
    { value: 'Above 54', viewValue: 'Above 54' }
  ];

  constructor(public snackbar: MatSnackBar, 
              public audio: AudioService,
              public data: DataService,
              public keyboardNav: KeyboardNavigationService) { }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return this.formValid };
    this.keyboardNav.onGoNextConditionFail = () => { this.showProblemMessage(); }

    this.data.stupidThing = true;

    this.audio.loadAudioPlayers();
    this.model = this.data.questionnaire;
  }

  public get formValid() {
    return this.model.age !== undefined &&
           this.model.hearingDifficulties !== undefined &&
           this.model.listeningTestParticipation !== undefined 
  }
  
  public showProblemMessage() {
    this.snackbar.open('the first three fields are required', null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ['my-snackbar-problem']
    });
  }

  public blur() {
    console.log(event);
    event.stopPropagation();
  }
}
