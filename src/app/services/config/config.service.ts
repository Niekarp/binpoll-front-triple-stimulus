import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConfig } from 'src/app/models/url-config.model';
import { version as npmAppVersion } from '../../../../package.json';
import { ApiClientService } from '../api-client/api-client.service.js';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly APP_VERSION = npmAppVersion;
  public readonly TEST_COUNT = 10;
  public readonly URL_CONFIG_URL = 'assets/config.json/';

  public urlConfig = new UrlConfig();
}

export function urlConfigProvider(api: ApiClientService, config: ConfigService): () => Promise<void> {
  return (): Promise<void> => {
    return new Promise((resolve, reject): void => {
      api.getUrlConfig(config.URL_CONFIG_URL)
          .toPromise()
          .then(urlconfig => {
            Object.assign(config.urlConfig, urlconfig);
            resolve();
          });
    });
  };
}
