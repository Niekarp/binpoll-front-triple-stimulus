import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { ApiClientService } from 'src/app/services/api-client/api-client.service';
import { DataService } from 'src/app/services/data/data.service';
import { PopUpService } from 'src/app/services/pop-up/pop-up.service';
import { UserComment } from 'src/app/models/user-comment';

@Component({
  selector: 'app-finish-page',
  templateUrl: './finish-page.component.html',
  styleUrls: ['./finish-page.component.scss']
})
export class FinishPageComponent implements OnInit {
  public commentSend = false;
  private comment = '';

  constructor(
      private popUp: PopUpService,
      private audio: AudioService,
      private apiClient: ApiClientService,
      private data: DataService) {
    window.onbeforeunload = null;
    this.data.shouldDisplayDialogWithWarning = false;
  }

  ngOnInit() { }

  public onSendCommentButtonClick(): void {
    if (this.commentSend) {
      this.popUp.showSuccessMessage('comment already sent');
    } else if (!this.commentSend && /\S/.test(this.comment)) {
      const userComment = new UserComment(this.data.dataResponseId, this.comment);
      this.apiClient.sendComment(userComment).subscribe();
      this.popUp.showSuccessMessage('comment has been sent');
      this.commentSend = true;
    } else {
      this.popUp.showProblemMessage('comment field must not be empty');
    }
  }
}
