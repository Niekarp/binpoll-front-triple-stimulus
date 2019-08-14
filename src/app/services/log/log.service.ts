import { Injectable } from '@angular/core';
import { ApiClientService } from '../api-client/api-client.service';
import prune from 'json-prune';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  // Config
  private readonly MESSAGE_OBJECT_DEPTH = 5;
  private readonly MESSAGE_MAX_BYTE_SIZE = 100000; // 100KB
  private readonly CONSOLE_MESSAGE_PRUNE_OPTIONS =
    { depthDecr: this.MESSAGE_OBJECT_DEPTH, inheritedProperties: false, prunedString: '"-pruned-"' };
  private readonly ERROR_EVENT_MESSAGE_OPTIONS =
    { depthDecr: this.MESSAGE_OBJECT_DEPTH, allProperties: true, prunedString: '"-pruned-"' };

  // Fields to prevent infinite message loops
  private readonly MESSAGE_LIMIT = 500;
  private readonly MESSAGE_PAUSE_LIMIT = 50;
  private readonly MESSAGE_PAUSE_TIME = 20000; // 20s
  private messageCount = 0;
  private messagePause = false; // stops logging service forever if true

  private defaultConsoleLog = console.log;
  private defaultConsoleInfo = console.info;
  private defaultConsoleWarn = console.warn;
  private defaultConsoleError = console.error;
  private defaultConsoleDebug = console.debug;
  private errorEventListener: (event: ErrorEvent) => boolean;

  constructor(public api: ApiClientService) {
    this.errorEventListener = (event): boolean => {
      this.prepareAndSendMessage('error event', undefined, [event], this.ERROR_EVENT_MESSAGE_OPTIONS);
      return false;
    };
  }

  public setLoggingToServer(): void {
    console.log = (message?: any, ...optionalParams: any[]): void => {
      this.defaultConsoleLog(message, ...optionalParams);
      this.prepareAndSendMessage('log', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    };
    console.info = (message?: any, ...optionalParams: any[]): void => {
      this.defaultConsoleInfo(message, ...optionalParams);
      this.prepareAndSendMessage('info', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    };
    console.warn = (message?: any, ...optionalParams: any[]): void => {
      this.defaultConsoleWarn(message, ...optionalParams);
      this.prepareAndSendMessage('warn', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    };
    console.error = (message?: any, ...optionalParams: any[]): void => {
      this.defaultConsoleError(message, ...optionalParams);
      this.prepareAndSendMessage('error', message, optionalParams, this.ERROR_EVENT_MESSAGE_OPTIONS);
    };
    console.debug = (message?: any, ...optionalParams: any[]): void => {
      this.defaultConsoleDebug(message, ...optionalParams);
      this.prepareAndSendMessage('debug', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    };
    window.addEventListener('error', this.errorEventListener, { capture: true });
  }

  public resetLogging(): void {
    console.log = this.defaultConsoleLog;
    console.info = this.defaultConsoleInfo;
    console.warn = this.defaultConsoleWarn;
    console.error = this.defaultConsoleError;
    console.debug = this.defaultConsoleDebug;
    window.removeEventListener('error', this.errorEventListener);
  }

  private prepareAndSendMessage(messageType: string, message: any, optionalParams: any[], pruneOptions: object): void {
    if (this.messagePause) { return; }

    if (!message) { message = ''; }
    pruneOptions['replacer'] = this.pruneReplacer;

    let prunedMessage;
    let prunedOptionalParams;
    do {
      prunedMessage = prune(message, pruneOptions);
      prunedOptionalParams = optionalParams.map((param) => prune(param, pruneOptions));

      const messageLength = prunedMessage.length + prunedOptionalParams.toString().length;
      if (messageLength < this.MESSAGE_MAX_BYTE_SIZE) {
        break;
      }

      pruneOptions['depthDecr'] -= 1;
    } while (true);

    const consoleMessage = {
      content: prunedMessage + ',' + prunedOptionalParams.toString(),
      type: messageType
    };
    this.api.sendConsoleMessage(consoleMessage).subscribe(() => {}, error => {
      this.defaultConsoleError('log message could not be sent');
      this.defaultConsoleError(error);
    });

    this.messageCount += 1;
    this.pauseOrStopLoggingIfLoopAppeared();
  }

  private pruneReplacer(value, defaultValue, circular): string {
    if (circular) { return '"-circular-"'; }
    if (Array.isArray(value)) { return defaultValue.replace(/]$/, ',"-truncated-"]'); }
    return '"-pruned-"';
  }

  private pauseOrStopLoggingIfLoopAppeared(): void {
    if (this.messageCount >= this.MESSAGE_LIMIT) {
      this.messagePause = true;
      this.resetLogging();
    } else if ((this.messageCount % this.MESSAGE_PAUSE_LIMIT) === 0) {
      this.resetLogging();
      setTimeout(() => {
        this.setLoggingToServer();
      }, this.MESSAGE_PAUSE_TIME);
    }
  }
}
