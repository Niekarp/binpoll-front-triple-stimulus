import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, retryWhen, delay, tap } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { PollData } from '../../models/poll-data.model';
import { ProblemReport } from '../../models/problem-report.model';
import { UrlConfig } from 'src/app/models/url-config.model';
import { SampleSet } from '../../models/sample-set.model';
import { Sample } from 'src/app/models/sample.model';
import { ConsoleMessage } from 'src/app/models/console-message.model';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private urlConfigObservable: Observable<UrlConfig>;

  constructor(
      private data: DataService,
      private http: HttpClient,
      private configService: ConfigService) {
    this.urlConfigObservable = configService.getConfig();
  }

  public getSampleSet(): Observable<SampleSet> {
    return this.urlConfigObservable.pipe(
        mergeMap(config => {
          return this.http.get<SampleSet>(config.apiUrl + 'generate_set').pipe(
              map(audioSet => {
                const samples = audioSet.samples as string[][];
                const mappedSamples = [] as Sample[][];

                samples.forEach((sampleVariants, sampleIndex) => {
                  mappedSamples[sampleIndex] = sampleVariants.map(sampleVariantName => ({
                    url: config.pollSoundsUrl + sampleVariantName,
                    scene: sampleVariantName.substring(sampleVariantName.length - 6, sampleVariantName.length - 4)
                  }));
                });
                audioSet.samples = mappedSamples;

                return audioSet;
              }));
        }),
        catchError(this.handleError));
  }

  public getAudioPlayer(url: string): Observable<Blob> {
    return this.http.get(url, {responseType: 'blob'}).pipe(
        catchError(this.handleError)
    );
  }

  public getAudioBlob(url: string): Observable<ArrayBuffer> {
    return this.http.get(url, {responseType: 'arraybuffer'}).pipe(
        retryWhen(errors => {
          if (!this.data.redownloadStarted) {
            this.data.redownloadStarted = true;
            console.warn('retrying audio download started');
          }
          let downloadCount = 0;
          return errors.pipe(
              tap(error => {
                downloadCount += 1;
                if (downloadCount >= this.data.redownloadCount) {
                  console.warn(`could not download audio(attempt ${downloadCount})`);
                  console.error(error);
                  this.data.redownloadCount += 1;
                }
                if (downloadCount >= 10) {
                  throw 'could not download audio after 10 attempts';
                }
              }),
              delay(25000));
        }),
        tap(response => {
          if (this.data.redownloadStarted && !this.data.redownloadSuccessLogged) {
            this.data.redownloadSuccessLogged = true;
            console.info('audio downloaded after redownload');
          }
        }),
        catchError(this.handleError));
  }

  public getExampleVideo(): Observable<Blob> {
    return this.urlConfigObservable.pipe(
        mergeMap(config => {
          return this.http.get(config.exampleVideoAssetUrl + 'poll-example-movie.mov', {responseType: 'blob'});
        }),
        catchError(this.handleError));
  }

  public sendPollData(pollData: PollData): Observable<object> {
    return this.urlConfigObservable.pipe(
        mergeMap(config => {
          const url: string = config.apiUrl + 'poll_data/';
          const pollDataToSend = {
            start_date: pollData.startDate.toISOString(),
            end_date: pollData.endDate.toISOString(),
            assigned_set_id: pollData.assignedSetId,
            answers: pollData.answer,
            user_info: pollData.userInfo,
            seed: this.data.seed
          };
          return this.http.post(url, pollDataToSend);
        }),
        catchError(this.handleError));
  }

  public sendComment(comment: string): Observable<object> {
    return this.urlConfigObservable.pipe(
        mergeMap(config => {
          const url: string = config.apiUrl + 'comment/';
          return this.http.post(url, {
            poll_data: this.data.dataResponseId,
            message: comment
          });
        }),
        catchError(this.handleError));
  }

  public sendProblemReport(report: ProblemReport): Observable<object> {
    return this.urlConfigObservable.pipe(
        mergeMap(config => {
          const url: string = config.apiUrl + 'problem/';
          return this.http.post(url, report);
        }),
        catchError(this.handleError));
  }

  public sendConsoleMessage(message: ConsoleMessage): Observable<object> {
    return this.urlConfigObservable.pipe(
        mergeMap(config => {
          const url: string = config.apiUrl + 'log/';
          return this.http.post(url, message.content, { headers: new HttpHeaders({'MESSAGE-TYPE': message.type}) });
        }));
  }

  private handleError(error: Error): Observable<never> {
    console.error(error);
    return throwError('api request error occured');
  }
}
