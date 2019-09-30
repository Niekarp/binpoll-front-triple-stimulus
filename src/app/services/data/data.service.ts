import { Injectable } from '@angular/core';
import { Questionnaire } from 'src/app/models/questionnaire.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Application control
  public appStop = false;

  // Api
  public seed = null;

  // Welcome page data
  public consentChecked = false;
  public captchaResolved = false;

  // Questionnaire page data
  public questionnaire = new Questionnaire();

  // Poll page data
  public pollDataInitiated = false;
  public audioPool = [];
  public fbDropZone = [];
  public bfDropZone = [];
  public ffDropZone = [];
  public audioPlayed = Array<boolean[]>(10);
  public startDate: Date;

  // Dialog with warning on page leave
  public shouldDisplayDialogWithWarning = false;

  // Resources
  public exampleVideoUrl = null;

  // Audio download (used in audio-service)
  public redownloadStarted = false;
  public redownloadSuccessLogged = false;
  public redownloadCount = 1;
}
