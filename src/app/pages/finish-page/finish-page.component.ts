import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AudioService } from 'src/app/services/audio/audio.service';
import { ApiClientService } from 'src/app/services/api-client/api-client.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-finish-page',
  templateUrl: './finish-page.component.html',
  styleUrls: ['./finish-page.component.scss']
})
export class FinishPageComponent implements OnInit {

  private comment: string = '';
  private isCommeentSend: boolean = false;

  constructor(public snackbar: MatSnackBar, public audio: AudioService, public apiClient: ApiClientService, public data: DataService) {
    window.onbeforeunload = null;
  }

  ngOnInit() {
    this.data.stupidThing = false;
  }

  onSendCommentButtonClick() {
    if (this.isCommeentSend) {
      this.snackbar.open('comment already sent', null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ['my-snackbar-confirm']
      });
    }
    else if (this.isCommeentSend === false && /\S/.test(this.comment)) {
      this.apiClient.sendComment(this.comment, () => {
        this.snackbar.open('comment has been sent', null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ['my-snackbar-confirm']
        });
        (document.getElementsByClassName('navigation-button').item(0) as HTMLElement).style.backgroundColor = 'gray';
        this.isCommeentSend = true;
      })
    }
    else {
      this.snackbar.open('comment field must not be empty', null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ['my-snackbar-problem']
      });
    }
  }
}
