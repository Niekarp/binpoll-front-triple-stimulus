import { Component, OnInit } from '@angular/core';
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

  constructor(
      private snackbar: MatSnackBar,
      private audio: AudioService,
      private apiClient: ApiClientService,
      private data: DataService) {
    window.onbeforeunload = null;
    this.data.shouldDisplayDialogWithWarning = false;
  }

  ngOnInit() { }

  public onSendCommentButtonClick(): void {
    if (this.isCommeentSend) {
      this.showSuccessMessage('comment already sent');
    } else if (!this.isCommeentSend && /\S/.test(this.comment)) {
      this.apiClient.sendComment(this.comment).subscribe(() => {
        this.showSuccessMessage('comment has been sent');
        (document.getElementsByClassName('navigation-button').item(0) as HTMLElement)
          .style
          .backgroundColor = 'gray';
        this.isCommeentSend = true;
      });
    } else {
      this.showProblemMessage('comment field must not be empty');
    }
  }

  private showProblemMessage(message: string): void {
    this.snackbar.open(message, null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ['my-snackbar-problem']
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackbar.open(message, null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ['my-snackbar-confirm']
    });
  }
}
