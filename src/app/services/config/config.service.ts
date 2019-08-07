import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConfig } from 'src/app/models/url-config.model';
import { version as npmAppVersion } from '../../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly appVersion: string = npmAppVersion;
  public readonly testCount: number = 10;
  public readonly urlConfigUrl: string = 'assets/config.json';

  constructor(private http: HttpClient) { }

  public getConfig(): Observable<UrlConfig> {
    return this.http.get<UrlConfig>(this.urlConfigUrl);
  }
}
