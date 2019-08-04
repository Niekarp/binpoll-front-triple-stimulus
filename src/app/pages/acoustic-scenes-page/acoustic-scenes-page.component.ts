
import { Component, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-acoustic-scenes-page',
  templateUrl: './acoustic-scenes-page.component.html',
  styleUrls: ['./acoustic-scenes-page.component.scss']
})
export class AcousticScenesPageComponent implements OnInit {
  constructor(public keyboardNav: KeyboardNavigationService) { }
  
  ngOnInit() {
    this.keyboardNav.goBackCondition = () => { return true; };
    this.keyboardNav.goNextCondition = () => { return true; };
  }
}
