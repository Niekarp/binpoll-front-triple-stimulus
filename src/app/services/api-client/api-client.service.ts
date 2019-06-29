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

  constructor(
    public data: DataService,
    private http: HttpClient,
    private configService: ConfigService) { 
      this.configObservable = configService.getConfig();
    }

  
  public sendPollData(pollData: PollData): void {
    this.configObservable.subscribe(config => {
      let url: string = config['apiUrl'];
      if(url == null) {
        console.error('apiUrl property not found');
      } else {
        url += 'poll_data/';
        this.http.post(url, {
          'start_date': pollData.startDate.toISOString(),
          'end_date': pollData.endDate.toISOString(),
          'assigned_set_id': pollData.assignedSetId,
          'answers': pollData.answer,
          'user_info': pollData.userInfo
        }).pipe(
          catchError((err) => {
            console.error(err);
            return of({})
          })).subscribe(response => {
            console.log('poll data sent: ', url);
            console.log(pollData);
            
            this.data.dataResponseId = response['id'];
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
          console.log('problem reported: ', url);
          console.log(report);
          return of({})
        }));
      }
    })).pipe(catchError((err) => {
      console.error(err);
      return of({})
    }));
  }

  public getSampleSet(): Observable<string[]> {
    return this.configObservable.pipe(switchMap(config => {
      let apiUrl = config['apiUrl'];
      let pollSoundsUrl = config['pollSoundsUrl'];
      if(apiUrl == null || pollSoundsUrl == null) {
        console.error('apiUrl property not found');
        return of(['']);
      } else {
        return this.http.get<string[]>(apiUrl + 'generate_set').pipe(
          switchMap(audioSet => {
            audioSet['samples'] = audioSet['samples'].map(url => pollSoundsUrl + url)
            return of(audioSet);
          }));
      }
    })).pipe(catchError(error => {
      console.error(error);
      return of(['']);
    }));
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
            console.log('comment sent: ', url);
            onSend();
          });
      }
    });
  }
}
