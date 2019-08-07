import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ApiClientService } from 'src/app/services/api-client/api-client.service';
import { DataService } from 'src/app/services/data/data.service';
import { AudioService } from 'src/app/services/audio/audio.service';

@Component({
  selector: 'app-report-problem-page',
  templateUrl: './report-problem-page.component.html',
  styleUrls: ['./report-problem-page.component.scss']
})
export class ReportProblemPageComponent implements OnInit {
  public message: string = '';
  private isReportSend: boolean = false;

  constructor(
      private snackbar: MatSnackBar,
      private audio: AudioService,
      private api: ApiClientService,
      private data: DataService) {
    //this.audio.stopAudioLoading();
    this.data.shouldDisplayDialogWithWarning = false;
  }

  ngOnInit() { }

  public onSendCommentButtonClick(): void {
    if (this.isReportSend) {
      this.showSuccessMessage('report already sent');
    } else if (!this.isReportSend && /\S/.test(this.message)) {
      let problemReport = {
        user_info: {
          headphones_make_and_model: this.data.questionnaire.typedHeadphonesMakeAndModel,
          hearing_difficulties: this.data.questionnaire.hearingDifficulties,
          listening_test_participated: this.data.questionnaire.listeningTestParticipation,
          age: this.data.questionnaire.age,
        },
        message: this.message
      };

      this.api.sendProblemReport(problemReport).subscribe(() => {
        this.showSuccessMessage('report has been sent');
        (document.getElementsByClassName('navigation-button').item(0) as HTMLElement)
          .style
          .backgroundColor = 'gray';
        this.isReportSend = true;
      });
    } else {
      this.showProblemMessage('report field must not be empty');
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
