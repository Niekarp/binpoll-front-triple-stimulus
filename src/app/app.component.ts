import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KeyboardNavigationService } from './services/keyboard-navigation/keyboard-navigation.service';
import { DataService } from './services/data/data.service';
import { ApiClientService } from './services/api-client/api-client.service';
import { LogService } from './services/log/log.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'binpoll-front';

  constructor(
      public router: Router,
      public keyboardNav: KeyboardNavigationService,
      public data: DataService,
      public api: ApiClientService,
      public logService: LogService,
      private sanitizer: DomSanitizer) {
    if (window.location.pathname === '/credits' || /\/debug(\/|$)/.test(window.location.pathname)) {
      return;
    }

    this.router.navigate(['/'], { replaceUrl: true });
    this.keyboardNav.router = this.router;
    this.keyboardNav.active = true;

    const subscription = this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd && (value as NavigationEnd).url === '/questionnaire') {
        logService.setLoggingToServer();
        subscription.unsubscribe();
      }
    });

    // Preload video
    this.api.getExampleVideo().subscribe(response => {
      const videoBlob = response;
      const videoBlobUrl = URL.createObjectURL(videoBlob);
      const trustedVideoBlobUrl = sanitizer.bypassSecurityTrustUrl(videoBlobUrl);
      this.data.exampleVideoUrl = trustedVideoBlobUrl;
    });
  }

  onActivate(): void {
    this.keyboardNav.restart();
  }

  @HostListener('window:beforeunload', ['$event'])
  displayDialogWithWarning($event): void {
    if (this.data.shouldDisplayDialogWithWarning) {
      $event.returnValue = true;
    } else {
      $event = undefined;
    }
  }
}
