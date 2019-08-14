import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Questionnaire } from 'src/app/models/questionnaire.model';
import { DataService } from 'src/app/services/data/data.service';
import { Age } from '../../models/age.model';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { PopUpService } from 'src/app/services/pop-up/pop-up.service';

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
  public EMPTY_FIELDS_POP_UP_MESSAGE = 'the first three fields are required';

  constructor(
      public data: DataService,
      public popUp: PopUpService,
      private audio: AudioService,
      private keyboardNav: KeyboardNavigationService) {
    this.model = this.data.questionnaire;
    this.data.shouldDisplayDialogWithWarning = true;
  }

  ngOnInit() {
    this.keyboardNav.goBackCondition = (): boolean => true;
    this.keyboardNav.goNextCondition = (): boolean => this.formValid;
    this.keyboardNav.onGoNextConditionFail =
      (): void => this.popUp.showProblemMessage(this.EMPTY_FIELDS_POP_UP_MESSAGE);
    this.audio.loadAudioPlayers();
  }

  public get formValid(): boolean {
    return this.model.age !== undefined &&
        this.model.hearingDifficultiesPresent !== undefined &&
        this.model.listeningTestParticipated !== undefined;
  }
}
