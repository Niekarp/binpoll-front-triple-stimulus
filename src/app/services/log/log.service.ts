import { Injectable } from '@angular/core';
import { ApiClientService } from '../api-client/api-client.service';
var prune = require('json-prune');

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private messageObjectDepth = 5;
  private messageObjectWidth = 50;
  private consoleMessagePruneOptions = { depthDecr: this.messageObjectDepth, inheritedProperties: false, prunedString: '"-pruned-"' };
  private errorEventMessagePruneOptions = { depthDecr: this.messageObjectDepth, inheritedProperties: true, prunedString: '"-pruned-"' };
  
  private defaultConsoleLog = console.log;
  private defaultConsoleInfo = console.info;
  private defaultConsoleWarn = console.warn;
  private defaultConsoleError = console.error;
  private errorEventListener: (event: any) => void;

  constructor(public api: ApiClientService) {
    this.errorEventListener = (event: any) => { this.prepareAndSendMessage('error event', undefined, [event], this.errorEventMessagePruneOptions); };
  }

  public setLoggingToServer() {
    console.log = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleLog(message, ...optionalParams);
      this.prepareAndSendMessage('log', message, optionalParams, this.consoleMessagePruneOptions);
    }
    console.info = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleInfo(message, ...optionalParams);
      this.prepareAndSendMessage('info', message, optionalParams, this.consoleMessagePruneOptions);
    }
    console.warn = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleWarn(message, ...optionalParams);
      this.prepareAndSendMessage('warn', message, optionalParams, this.consoleMessagePruneOptions);
    }
    console.error = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleError(message, ...optionalParams);
      this.prepareAndSendMessage('error', message, optionalParams, this.consoleMessagePruneOptions);
    }
    window.addEventListener('error', this.errorEventListener, { capture: true });
  }

  public resetLogging() {
    console.log = this.defaultConsoleLog;
    console.info = this.defaultConsoleInfo;
    console.warn = this.defaultConsoleWarn;
    console.error = this.defaultConsoleError;
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
      if(messageLength < 1000000){
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
