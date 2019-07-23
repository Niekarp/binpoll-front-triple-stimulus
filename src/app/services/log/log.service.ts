import { Injectable } from '@angular/core';
import { ApiClientService } from '../api-client/api-client.service';
var prune = require('json-prune');

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly MESSAGE_OBJECT_DEPTH = 5;
  private readonly MESSAGE_MAX_BYTE_SIZE = 100000; // 100KB
  private readonly CONSOLE_MESSAGE_PRUNE_OPTIONS = { depthDecr: this.MESSAGE_OBJECT_DEPTH, inheritedProperties: false, prunedString: '"-pruned-"' };
  private readonly ERROR_EVENT_MESSAGE_OPTIONS = { depthDecr: this.MESSAGE_OBJECT_DEPTH, inheritedProperties: true, prunedString: '"-pruned-"' };
  
  private defaultConsoleLog = console.log;
  private defaultConsoleInfo = console.info;
  private defaultConsoleWarn = console.warn;
  private defaultConsoleError = console.error;
  private defaultConsoleDebug = console.debug;
  private errorEventListener: (event: any) => boolean;

  constructor(public api: ApiClientService) {
    this.errorEventListener = (event: any) => { this.prepareAndSendMessage('error event', undefined, [event], this.ERROR_EVENT_MESSAGE_OPTIONS); return false; };
  }

  public setLoggingToServer() {
    console.log = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleLog(message, ...optionalParams);
      this.prepareAndSendMessage('log', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    }
    console.info = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleInfo(message, ...optionalParams);
      this.prepareAndSendMessage('info', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    }
    console.warn = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleWarn(message, ...optionalParams);
      this.prepareAndSendMessage('warn', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    }
    console.error = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleError(message, ...optionalParams);
      this.prepareAndSendMessage('error', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    }
    console.debug = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleDebug(message, ...optionalParams);
      this.prepareAndSendMessage('debug', message, optionalParams, this.CONSOLE_MESSAGE_PRUNE_OPTIONS);
    }
    window.addEventListener('error', this.errorEventListener, { capture: true });
  }

  public resetLogging() {
    console.log = this.defaultConsoleLog;
    console.info = this.defaultConsoleInfo;
    console.warn = this.defaultConsoleWarn;
    console.error = this.defaultConsoleError;
    console.debug = this.defaultConsoleDebug;
    window.removeEventListener('error', this.errorEventListener)
  }

  private prepareAndSendMessage(messageType: string, message: any, optionalParams: any[], pruneOptions: object): void {
    if (message === undefined) message = '';
    pruneOptions['replacer'] = this.pruneReplacer;
    
    let prunedMessage;
    let prunedOptionalParams;
    do{
      prunedMessage = prune(message, pruneOptions);
      prunedOptionalParams = optionalParams.map((param) => prune(param, pruneOptions));

      let messageLength = prunedMessage.length + prunedOptionalParams.toString().length;
      if(messageLength < this.MESSAGE_MAX_BYTE_SIZE){
        break;
      };

      pruneOptions['depthDecr'] -= 1;
    } while(true)

    this.api.sendConsoleMessage({
      message: prunedMessage + ',' + prunedOptionalParams.toString(),
      message_type: messageType
    });
  }

  private pruneReplacer(value, defaultValue, circular) {
      if (circular) return '"-circular-"';
      if (Array.isArray(value)) return defaultValue.replace(/]$/, ',"-truncated-"]');
      return '"-pruned-"';
  }
}
