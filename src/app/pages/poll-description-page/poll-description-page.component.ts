import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SharedConfig } from 'src/app/config/shared-config';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-poll-description-page',
  templateUrl: './poll-description-page.component.html',
  styleUrls: ['./poll-description-page.component.scss']
})
export class PollDescriptionPageComponent implements OnInit {

  private testCount: number;

  constructor(public sharedConfig: SharedConfig, public keyboardNav: KeyboardNavigationService) {
    this.testCount = sharedConfig.testCount;
  }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true };
  }
}
