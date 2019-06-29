import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation/keyboard-navigation.service';

@Component({
  selector: 'app-policy-page',
  templateUrl: './policy-page.component.html',
  styleUrls: ['./policy-page.component.scss']
})
export class PolicyPageComponent implements OnInit {

  constructor(public router: Router, public keyboardNav: KeyboardNavigationService) { }

  ngOnInit() {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.keyboardNav.active = true;
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }
}
