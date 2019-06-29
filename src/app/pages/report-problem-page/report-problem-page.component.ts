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
    public snackbar: MatSnackBar,
    public audio: AudioService,
    private api: ApiClientService,
    private data: DataService) { }

  ngOnInit() {
    this.audio.stopAudioLoading();
    this.data.stupidThing = false;
  }

  onSendCommentButtonClick() {
    if (this.isReportSend) {
      this.snackbar.open('report already sent', null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ['my-snackbar-confirm']
      });
    }
    else if (this.isReportSend === false && /\S/.test(this.message)) {
      this.api.reportProblem({
        user_info: {
          headphones_make_and_model: this.data.questionnaire.typedHeadphonesMakeAndModel,
          hearing_difficulties: this.data.questionnaire.hearingDifficulties,
          listening_test_participated: this.data.questionnaire.listeningTestParticipation,
          age: this.data.questionnaire.age,
        },
        message: this.message
      }).subscribe(() => {
        this.snackbar.open('report has been sent', null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ['my-snackbar-confirm']
        });
        (document.getElementsByClassName('navigation-button').item(0) as HTMLElement).style.backgroundColor = 'gray';
        this.isReportSend = true;
      });
    }
    else {
      this.snackbar.open('report field must not be empty', null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ['my-snackbar-problem']
      });
    }
  }
}
