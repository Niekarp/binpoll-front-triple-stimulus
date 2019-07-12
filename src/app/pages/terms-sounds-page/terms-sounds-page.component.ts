import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import *  as $ from 'jquery';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-terms-sounds-page',
  templateUrl: './terms-sounds-page.component.html',
  styleUrls: ['./terms-sounds-page.component.scss']
})
export class TermsSoundsPageComponent implements OnInit {

  constructor(public keyboardNav: KeyboardNavigationService) {
  }

  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; }
    this.keyboardNav.goNextCondition = () => { return true };
  }
}
