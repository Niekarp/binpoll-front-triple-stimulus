import { Component, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-poll-description-page',
  templateUrl: './poll-description-page.component.html',
  styleUrls: ['./poll-description-page.component.scss']
})
export class PollDescriptionPageComponent implements OnInit {
  public testCount: number;

  constructor(private config: ConfigService, private keyboardNav: KeyboardNavigationService) {
    this.testCount = config.TEST_COUNT;
  }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true; };
  }
}
