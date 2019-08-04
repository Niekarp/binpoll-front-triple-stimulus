import { Injectable } from '@angular/core';
import { Questionnaire } from 'src/app/models/questionnaire';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataResponseId = null;

  // Welcome page data
  public consentChecked = false;

  // Questionnaire page data
  public questionnaire = new Questionnaire();

  // Poll page data
  public pollDataInitiated = false;
  public audioPool = [];
  public fbDropZone = [];
  public bfDropZone = [];
  public ffDropZone = [];
  public wasAudioPlayed = Array<boolean[]>(10);
  public startDate: Date;

  // Dialog with warning on page leave
  public shouldDisplayDialogWithWarning = false;

  // Resources
  public exampleVideoUrl = null;

  // Audio download (used in audio-service)
  public redownloadStarted: boolean = false;
  public redownloadCount: number = 1;

  constructor() { }
}
