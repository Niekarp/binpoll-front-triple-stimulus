import { Component, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-poll-example-page',
  templateUrl: './poll-example-page.component.html',
  styleUrls: ['./poll-example-page.component.scss']
})
export class PollExamplePageComponent implements OnInit {

  constructor(public keyboardNav: KeyboardNavigationService) {
  }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true };
  }
}
