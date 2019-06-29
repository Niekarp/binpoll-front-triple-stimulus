import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-terms-back-scene-page',
  templateUrl: './terms-back-scene-page.component.html',
  styleUrls: ['./terms-back-scene-page.component.scss']
})
export class TermsBackScenePageComponent implements OnInit {

  constructor(public keyboardNav: KeyboardNavigationService) { }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true };
  }
}
