import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ConfigService } from '../../config/config.service'
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Questionnaire } from 'src/app/models/questionnaire';
import { DataService } from '../data/data.service';
import { PollData } from "../../models/PollData"
import { ProblemReport } from "../../models/ProblemReport"

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private configObservable: Observable<any>;
  private sampleSetObservable: Observable<{[id: string]: any}>;

  constructor(
    public data: DataService,
    private http: HttpClient,
    private configService: ConfigService) { 
      this.configObservable = configService.getConfig();
      this.sampleSetObservable = this.prepareSampleSet();
    }
  
  public sendPollData(pollData: PollData): void {
    this.configObservable.subscribe(config => {
      let url: string = config['apiUrl'];
      if(url == null) {
        console.error('apiUrl property not found');
      } else {
        this.sampleSetObservable.subscribe(sampleSet => {
          url += 'poll_data/';
          this.http.post(url, {
            'start_date': pollData.startDate.toISOString(),
            'end_date': pollData.endDate.toISOString(),
            'assigned_set_id': pollData.assignedSetId,
            'answers': pollData.answer,
            'user_info': pollData.userInfo,
            'seed': sampleSet['seed']
          }).pipe(
            catchError((err) => {
              console.error(err);
              return of({})
            })).subscribe(response => {
              console.log('poll data sent: ', url);
              console.log(pollData);

              this.data.dataResponseId = response['id'];
            });
        });
      }
    });
  }

  public reportProblem(report: ProblemReport): Observable<{}> {
    return this.configObservable.pipe(switchMap(config => {
      let url: string = config['apiUrl'];
      if(url == null) {
        console.error('apiUrl property not found');
      } else {
        url += 'problem/';
        return this.http.post(url, report).pipe(switchMap(() => {
          // console.log('problem reported: ', url);
          // console.log(report);
          return of({})
        }));
      }
    })).pipe(catchError((err) => {
      console.error(err);
      return of({})
    }));
  }

  public getSampleSet(): Observable<{[id: string]: any}> {
    return this.sampleSetObservable;
  }

  public sendComment(comment: string, onSend: () => void): void {
    this.configObservable.subscribe(config => {
      let url: string = config['apiUrl'];
      if(url == null) {
        console.error('apiUrl property not found');
      } else {
        url += 'comment/';
        this.http.post(url, {
          'poll_data': this.data.dataResponseId,
          'message': comment
        }).pipe(
          catchError((err) => {
            console.error(err);
            return of({})
          })).subscribe(response => {
            // console.log('comment sent: ', url);
            onSend();
          });
      }
    });
  }

  public sendConsoleMessage(messageObj: { message: string, message_type: string }): void {
    this.configObservable.subscribe(config => {
      let url: string = config['apiUrl'];
      if(url == null) {
        // console.error('apiUrl property not found');
      } else {
        url += 'log/';
        this.http.post(url, {
          'message': messageObj.message,
          'message_type': messageObj.message_type
        }).pipe(
          catchError((err) => {
            // console.error(err);
            return of({})
          })).subscribe(response => {
            // console.log('comment sent: ', url);
          });
      }
    });
  }

  private prepareSampleSet(): Observable<{[id: string]: any}> {
    return this.sampleSetObservable = this.configObservable.pipe(switchMap(config => {
      let apiUrl = config['apiUrl'];
      let pollSoundsUrl = config['pollSoundsUrl'];
      if(apiUrl == null || pollSoundsUrl == null) {
        console.error('apiUrl property not found');
        return of({});
      } else {
        return this.http.get<{[id: string]: any}>(apiUrl + 'generate_set').pipe(
          switchMap(audioSet => {
            
            console.log('getSampleSet -> audioSet: ');
            console.log(audioSet);

            let samples = audioSet['samples'] as Array<string[]>;
            samples.forEach(function forEachSample(sampleVariants, sampleIndex) {
              (samples[sampleIndex] as Array<Object>) = sampleVariants.map(function toUrlAndSceneObject(sampleVariantName) {
                return {
                  url: pollSoundsUrl + sampleVariantName,
                  scene: sampleVariantName.substring(sampleVariantName.length - 6, sampleVariantName.length - 4)
                }
              });
            });
            return of(audioSet);
        }));
      }
    })).pipe(catchError(error => {
      console.error(error);
      return of({});
    }));
  }
}
