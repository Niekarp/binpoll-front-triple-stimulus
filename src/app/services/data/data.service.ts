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

  // ???
  public stupidThing = false;

  // Resources
  public exampleVideoUrl = null;

  constructor() { }
}
