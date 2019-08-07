import { Component, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-poll-example-page',
  templateUrl: './poll-example-page.component.html',
  styleUrls: ['./poll-example-page.component.scss']
})
export class PollExamplePageComponent implements OnInit {
  constructor(public data: DataService, private keyboardNav: KeyboardNavigationService) { }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; };
    this.keyboardNav.goNextCondition = () => { return true; };
  }
}
