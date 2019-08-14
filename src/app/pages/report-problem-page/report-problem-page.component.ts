import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client/api-client.service';
import { DataService } from 'src/app/services/data/data.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { PopUpService } from 'src/app/services/pop-up/pop-up.service';

@Component({
  selector: 'app-report-problem-page',
  templateUrl: './report-problem-page.component.html',
  styleUrls: ['./report-problem-page.component.scss']
})
export class ReportProblemPageComponent implements OnInit {
  public reportSent = false;
  public message = '';

  constructor(
      private popUp: PopUpService,
      private audio: AudioService,
      private api: ApiClientService,
      private data: DataService) {
    this.audio.stopAudioLoading();
    this.data.shouldDisplayDialogWithWarning = false;
  }

  ngOnInit() { }

  public onSendReportButtonClick(): void {
    if (this.reportSent) {
      this.popUp.showSuccessMessage('report already sent');
    } else if (!this.reportSent && /\S/.test(this.message)) {
      const problemReport = {
        user_info: {
          headphones_make_and_model: this.data.questionnaire.typedHeadphonesMakeAndModel,
          hearing_difficulties: this.data.questionnaire.hearingDifficultiesPresent,
          listening_test_participated: this.data.questionnaire.listeningTestParticipated,
          age: this.data.questionnaire.age,
        },
        message: this.message
      };

      this.api.sendProblemReport(problemReport).subscribe();
      this.popUp.showSuccessMessage('report has been sent');
      this.reportSent = true;
    } else {
      this.popUp.showProblemMessage('report field must not be empty');
    }
  }
}
