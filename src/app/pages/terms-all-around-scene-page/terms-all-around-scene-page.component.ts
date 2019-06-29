import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-terms-all-around-scene-page',
  templateUrl: './terms-all-around-scene-page.component.html',
  styleUrls: ['./terms-all-around-scene-page.component.scss']
})
export class TermsAllAroundScenePageComponent implements OnInit {

  constructor(private router: Router, public keyboardNav: KeyboardNavigationService) { }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true };
  }
}
