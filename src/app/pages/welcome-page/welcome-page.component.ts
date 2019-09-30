import { Component, OnInit, ViewChild } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { DataService } from 'src/app/services/data/data.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { PopUpService } from 'src/app/services/pop-up/pop-up.service';
import { Router } from '@angular/router';
import { ApiClientService } from 'src/app/services/api-client/api-client.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  @ViewChild('captchaRef')
  public captchaRef: RecaptchaComponent;
  public appVersion: string;
  public testCount: number;
  public authStarted: boolean;
  public readonly ACCEPT_TERMS_POP_UP_MESSAGE = 'terms and policy must be accepted';
  private readonly BAD_CAPTCHA_RESPONSE = 'invalid recaptcha answer. please try again';

  constructor(
      public data: DataService,
      public popUp: PopUpService,
      private config: ConfigService,
      private keyboardNav: KeyboardNavigationService,
      public router: Router,
      public apiClient: ApiClientService) {
    this.appVersion = config.APP_VERSION;
    this.testCount = config.TEST_COUNT;
    this.authStarted = false;
  }

  ngOnInit() {
    this.keyboardNav.active = true;
    this.keyboardNav.goNextCondition = (): boolean => this.data.consentChecked;
    this.keyboardNav.onGoNextConditionFail = (): void => {
      this.popUp.showProblemMessage(this.ACCEPT_TERMS_POP_UP_MESSAGE);
    };
  }

  public onPolicyClick(): void {
    this.keyboardNav.active = false;
  }

  public onStartButtonClick(): void {
    if (this.data.captchaResolved) {
      this.router.navigateByUrl('/questionnaire', { skipLocationChange: true });
    } else {
      this.captchaRef.execute();
    }
  }

  public captchaResolved(captchaResponse: string): void {
    if (!captchaResponse) { return; }
    this.authStarted = true;
    this.apiClient.authorize(captchaResponse).subscribe((response) => {
      this.data.captchaResolved = true;
      this.onStartButtonClick();
    }, error => {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.authStarted = false;
        this.captchaRef.reset();
        this.popUp.showProblemMessage(this.BAD_CAPTCHA_RESPONSE);
      }
    });
  }
}
