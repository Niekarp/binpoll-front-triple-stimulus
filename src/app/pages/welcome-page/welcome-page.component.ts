import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { DataService } from 'src/app/services/data/data.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  public appVersion: string;
  public testCount: number;

  constructor(
      public data: DataService,
      private snackbar: MatSnackBar,
      private config: ConfigService,
      private keyboardNav: KeyboardNavigationService) { 
    this.appVersion = config.appVersion;
    this.testCount = config.testCount;
  }

  ngOnInit() {
    this.keyboardNav.active = true;
    this.keyboardNav.goNextCondition = () => { return this.data.consentChecked; };
    this.keyboardNav.onGoNextConditionFail = () => { this.showProblemMessage(); };
  }

  public showProblemMessage(): void {
    this.snackbar.open('terms and policy must be accepted', null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ['my-snackbar-problem']
    });
  }

  public onPolicyClick(): void {
    this.keyboardNav.active = false;
  }
}
