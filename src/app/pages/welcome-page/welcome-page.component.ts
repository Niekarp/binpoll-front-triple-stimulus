import { Component, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { DataService } from 'src/app/services/data/data.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { PopUpService } from 'src/app/services/pop-up/pop-up.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  public appVersion: string;
  public testCount: number;
  public readonly ACCEPT_TERMS_POP_UP_MESSAGE : string = 'terms and policy must be accepted';

  constructor(
      public data: DataService,
      public popUp: PopUpService,
      private config: ConfigService,
      private keyboardNav: KeyboardNavigationService) { 
    this.appVersion = config.appVersion;
    this.testCount = config.testCount;
  }

  ngOnInit() {
    this.keyboardNav.active = true;
    this.keyboardNav.goNextCondition = () => { return this.data.consentChecked; };
    this.keyboardNav.onGoNextConditionFail = () => { 
      this.popUp.showProblemMessage(this.ACCEPT_TERMS_POP_UP_MESSAGE);
    };
  }

  public onPolicyClick(): void {
    this.keyboardNav.active = false;
  }
}
