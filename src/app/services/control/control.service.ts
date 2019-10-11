import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { PopUpService } from '../pop-up/pop-up.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeyboardNavigationService } from '../keyboard-navigation/keyboard-navigation.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(
      private data: DataService,
      private popUp: PopUpService,
      private spinner: NgxSpinnerService,
      private keyboardNav: KeyboardNavigationService) { }

  public stopApplication(stopMessage: string): void {
    if (!this.data.appStop) {
      this.data.appStop = true;
      this.popUp.showFatalMessage(stopMessage);
      this.keyboardNav.active = false;
      this.data.shouldDisplayDialogWithWarning = false;
      this.spinner.hide();
    }
  }
}
