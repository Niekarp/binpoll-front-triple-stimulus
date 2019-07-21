import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KeyboardNavigationService } from './services/keyboard-navigation/keyboard-navigation.service';
import { DataService } from './services/data/data.service';
import { ApiClientService } from './services/api-client/api-client.service';
import { LogService } from './services/log/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'binpoll-front';
  
  constructor(public router: Router, public keyboardNav: KeyboardNavigationService, public data: DataService, public api: ApiClientService, public logService: LogService) {
    if (window.location.pathname === '/credits') return;

    this.router.navigate(['/'], { replaceUrl: true });
    this.keyboardNav.router = this.router;
    this.keyboardNav.active = true;

    logService.setLoggingToServer();

    console.log();
    console.log('console.log', { pies: 'name' }, 'napis',  { ala: { dom: 5 }, foo: 2 });
    console.info('console info');
    console.warn('console warn');
    console.error('console error');
  }

  ngOnInit() { }

  onActivate($event) {    
    this.keyboardNav.restart();
  }

  @HostListener('window:beforeunload', ['$event'])
  displayDialogWithWarning($event) {
    if (this.data.stupidThing)
      $event.returnValue = true;
    else
      $event = undefined;
  }
}
