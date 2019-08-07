import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Questionnaire } from 'src/app/models/questionnaire.model';
import { DataService } from 'src/app/services/data/data.service';
import { Age } from '../../models/age.model';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

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

  constructor(
      public snackbar: MatSnackBar, 
      public audio: AudioService,
      public data: DataService,
      public keyboardNav: KeyboardNavigationService) {
    this.model = this.data.questionnaire;
    this.data.shouldDisplayDialogWithWarning = true;
  }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return this.formValid };
    this.keyboardNav.onGoNextConditionFail = () => { this.showProblemMessage(); }
    this.audio.loadAudioPlayers();
  }

  public get formValid(): boolean {
    return this.model.age !== undefined &&
        this.model.hearingDifficulties !== undefined &&
        this.model.listeningTestParticipation !== undefined 
  }
  
  public showProblemMessage(): void {
    this.snackbar.open('the first three fields are required', null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ['my-snackbar-problem']
    });
  }
}
