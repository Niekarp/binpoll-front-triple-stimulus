import { Injectable } from '@angular/core';
import { ApiClientService } from '../api-client/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private defaultConsoleLog = console.log;
  private defaultConsoleInfo = console.info;
  private defaultConsoleWarn = console.warn;
  private defaultConsoleError = console.error;

  constructor(public api: ApiClientService) { }

  setLoggingToServer() {
    console.log = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleLog(message, ...optionalParams);
      this.api.sendConsoleMessage({
        message: JSON.stringify(message) + ', ' + optionalParams.map((param) => JSON.stringify(param)).toString(),
        message_type: 'log'
      });
    }
    console.info = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleInfo(message, ...optionalParams);
      this.api.sendConsoleMessage({
        message: JSON.stringify(message) + ', ' + optionalParams.map((param) => JSON.stringify(param)).toString(),
        message_type: 'info'
      });
    }
    console.warn = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleWarn(message, ...optionalParams);
      this.api.sendConsoleMessage({
        message: JSON.stringify(message) + ', ' + optionalParams.map((param) => JSON.stringify(param)).toString(),
        message_type: 'warn'
      });
    }
    console.error = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleError(message, ...optionalParams);
      this.api.sendConsoleMessage({
        message: JSON.stringify(message) + ', ' + optionalParams.map((param) => JSON.stringify(param)).toString(),
        message_type: 'error'
      });
    }

    window.addEventListener('error', this.sendEventErrorLog);
  }

  resetLogging() {
    console.log = this.defaultConsoleLog;
    console.info = this.defaultConsoleInfo;
    console.warn = this.defaultConsoleWarn;
    console.error = this.defaultConsoleError;
    window.removeEventListener('error', this.sendEventErrorLog)
  }

  private sendEventErrorLog(event: any): void {
    this.api.sendConsoleMessage({
      message: JSON.stringify(event),
      message_type: 'error event'
    });
  }
}
