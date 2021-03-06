import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen, delay, tap, timeout, take } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { PollData } from '../../models/poll-data.model';
import { ProblemReport } from '../../models/problem-report.model';
import { UrlConfig } from 'src/app/models/url-config.model';
import { SampleSet } from '../../models/sample-set.model';
import { Sample } from 'src/app/models/sample.model';
import { ConsoleMessage } from 'src/app/models/console-message.model';
import { PopUpService } from '../pop-up/pop-up.service';
import { KeyboardNavigationService } from '../keyboard-navigation/keyboard-navigation.service';
import { UserComment } from 'src/app/models/user-comment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ForbiddenError } from 'src/app/models/forbidden-error.model';
import { ControlService } from '../control/control.service';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private urlConfig: UrlConfig;

  constructor(
      private data: DataService,
      private http: HttpClient,
      private popUp: PopUpService,
      private config: ConfigService,
      private control: ControlService,
      private spinner: NgxSpinnerService,
      private keyboardNav: KeyboardNavigationService) {
    this.urlConfig = config.urlConfig;
  }

  // Method intended to be called by urlConfigProvider
  public getUrlConfig(url: string): Observable<UrlConfig> {
    const request = this.http.get<UrlConfig>(url);
    return this.pipeStandardRequestStrategy(request, false);
  }

  public authorize(captchaResponse: string): Observable<object>  {
    const url = `${this.urlConfig.apiUrl}/auth/`;
    const request = this.http.post(url, {captcha_response: captchaResponse});
    return this.pipeStandardRequestStrategy(request);
  }

  public getSampleSet(): Observable<SampleSet> {
    const url = `${this.urlConfig.apiUrl}/retain/`;
    const request = this.http.get<SampleSet>(url);
    return this.pipeStandardRequestStrategy(request).pipe(
        map(audioSet => this.projectAudioSet(audioSet)));
  }

  public getAudioPlayer(url: string): Observable<Blob> {
    const request = this.http.get(url, { responseType: 'blob'} );
    return this.pipeAudioRequestStrategy(request);
  }

  public getAudioBlob(url: string): Observable<ArrayBuffer> {
    const request = this.http.get(url, {responseType: 'arraybuffer'});
    return this.pipeAudioRequestStrategy(request);
  }

  public getExampleVideo(): Observable<Blob> {
    const url = `${this.urlConfig.exampleVideoAssetUrl}/poll-example-movie.mov`;
    const request = this.http.get(url, {responseType: 'blob'});
    return this.pipeStandardRequestStrategy(request, false);
  }

  public sendRenewRequest(): Observable<object> {
    const url = `${this.urlConfig.apiUrl}/renew/`;
    const request = this.http.post(url, {});
    return this.pipeStandardRequestStrategy(request, true, 5, 45000, 30000);
  }

  public sendPollData(pollData: PollData): Observable<object> {
    const url = `${this.urlConfig.apiUrl}/complete/`;
    const request = this.http.post(url, pollData.toSnakeCase());
    return this.pipeStandardRequestStrategy(request);
  }

  public sendComment(userComment: UserComment): Observable<object> {
    const url = `${this.urlConfig.apiUrl}/comment/`;
    const request = this.http.post(url, userComment);
    return this.pipeStandardRequestStrategy(request);
  }

  public sendProblemReport(report: ProblemReport): Observable<object> {
    const url = `${this.urlConfig.apiUrl}/problem/`;
    const request = this.http.post(url, report.toSnakeCase());
    return this.pipeStandardRequestStrategy(request);
  }

  public sendConsoleMessage(message: ConsoleMessage): Observable<object> {
    const url = `${this.urlConfig.apiUrl}/log/`;
    const headers = new HttpHeaders({'MESSAGE-TYPE': message.type});

    const request = this.http.post(url, message.content, { headers });
    return request;
  }

  private pipeStandardRequestStrategy<T>(
      observable: Observable<T>,
      stopApp = true,
      retryCount = 3,
      timeoutTime = 6500,
      retryInterval = 5000): Observable<T> {
    return observable.pipe(
        timeout(timeoutTime),
        retryWhen(errors => {
          return errors.pipe(
              map((error, index) => {
                if (error instanceof HttpErrorResponse && error.status === 403) {
                  throw error;
                }
                if (index === retryCount) {
                  throw error;
                }
                return error;
              }),
              delay(retryInterval),
              take(retryCount + 1));
        }),
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 403) {
            return throwError(new ForbiddenError(error.error));
          } else {
            return this.handleError(error, stopApp);
          }
        }));
  }

  private pipeAudioRequestStrategy<T>(observable: Observable<T>): Observable<T> {
    const retryCount = 10;
    const timeoutTime = 60000;
    const retryInterval = 15000;
    let downloadCount = 0;

    return observable.pipe(
        timeout(timeoutTime),
        retryWhen(errors => {
          if (!this.data.redownloadStarted) {
            this.data.redownloadStarted = true;
            console.warn('retrying audio download started');
          }
          return errors.pipe(
              tap(error => {
                downloadCount += 1;
                if (downloadCount >= this.data.redownloadCount) {
                  console.warn(`could not download audio(attempt ${downloadCount})`);
                  console.error(error);
                  this.data.redownloadCount += 1;
                }
                if (downloadCount >= retryCount) {
                  throw new Error('could not download audio after 10 attempts');
                }
              }),
              delay(retryInterval));
        }),
        tap(() => {
          if (this.data.redownloadStarted && !this.data.redownloadSuccessLogged) {
            this.data.redownloadSuccessLogged = true;
            console.info('audio downloaded after redownload');
          }
        }),
        catchError(err => this.handleError(err, true)));
  }

  private handleError(error: Error, stopApp: boolean): Observable<never> {
    console.error(error);

    if (stopApp) {
      this.control.stopApplication(
          `An error occured. 
          Cannot connect to the server. 
          Please try completing the test later. 
          We are sorry for this condition.`);
    }

    return throwError('api request error occured');
  }

  private projectAudioSet(audioSet: SampleSet): SampleSet {
    if ((audioSet as any).state === 'fail') { return audioSet; }
    const samples = audioSet.samples as string[][];
    const mappedSamples = [] as Sample[][];

    samples.forEach((sampleVariants, sampleIndex) => {
      mappedSamples[sampleIndex] = sampleVariants.map(sampleVariantName => ({
        url: this.urlConfig.pollSoundsUrl + sampleVariantName,
        scene: sampleVariantName.substring(sampleVariantName.length - 6, sampleVariantName.length - 4)
      }));
    });
    audioSet.samples = mappedSamples;

    return audioSet;
  }
}
