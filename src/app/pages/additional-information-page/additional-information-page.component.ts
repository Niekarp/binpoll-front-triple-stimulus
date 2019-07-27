import { Component, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-additional-information-page',
  templateUrl: './additional-information-page.component.html',
  styleUrls: ['./additional-information-page.component.scss']
})
export class AdditionalInformationPageComponent implements OnInit {
  constructor(public keyboardNav: KeyboardNavigationService) {}

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true; };
  }
}
