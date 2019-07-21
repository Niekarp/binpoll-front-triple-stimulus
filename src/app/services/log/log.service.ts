import { Injectable } from '@angular/core';
import { ApiClientService } from '../api-client/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private messageObjectDepth = 3;
  private messageObjectWidth = 50;
  
  private defaultConsoleLog = console.log;
  private defaultConsoleInfo = console.info;
  private defaultConsoleWarn = console.warn;
  private defaultConsoleError = console.error;

  private errorEventListener: (event: any) => void;

  constructor(public api: ApiClientService) {
    this.errorEventListener = (event: any) => { this.prepareAndSendEventErrorLog(event); };
  }

  setLoggingToServer() {
    console.log = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleLog(message, ...optionalParams);
      this.prepareAndSendMessage('log', message, optionalParams);
    }
    console.info = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleInfo(message, ...optionalParams);
      this.prepareAndSendMessage('info', message, optionalParams);
    }
    console.warn = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleWarn(message, ...optionalParams);
      this.prepareAndSendMessage('warn', message, optionalParams);
    }
    console.error = (message?: any, ...optionalParams: any[]) => {
      this.defaultConsoleError(message, ...optionalParams);
      this.prepareAndSendMessage('error', message, optionalParams);
    }
    window.addEventListener('error', this.errorEventListener, { capture: true });
  }

  resetLogging() {
    console.log = this.defaultConsoleLog;
    console.info = this.defaultConsoleInfo;
    console.warn = this.defaultConsoleWarn;
    console.error = this.defaultConsoleError;
    window.removeEventListener('error', this.errorEventListener)
  }

  private prepareAndSendMessage(messageType: string, message: any, optionalParams: any[]): void {
    let reducedMessage = message;
    if(typeof reducedMessage === 'object' && reducedMessage !== null){
      reducedMessage = this.createDeepCopy(message, this.messageObjectDepth);
    }
    let reducedOptionalParams = optionalParams.map((param) => {
      if(typeof param === 'object' && param !== null){
        return this.createDeepCopy(param, this.messageObjectDepth);
      }
      return param;
    });

    this.api.sendConsoleMessage({
      message: JSON.stringify(reducedMessage, this.getCircularReplacer()) + ',' + reducedOptionalParams.map((param) => JSON.stringify(param, this.getCircularReplacer())).toString(),
      message_type: messageType
    });
  }

  private prepareAndSendEventErrorLog(event: any): void {
    debugger
    let reducedEvent = event;
    if(typeof reducedEvent === 'object' && reducedEvent !== null){
      reducedEvent = this.createEventDeepCopy(event, 4);
    }

    this.api.sendConsoleMessage({
      message: JSON.stringify(reducedEvent, this.getCircularReplacer()),
      message_type: 'error event'
    });
  }

  private createDeepCopy(source: object, depth: number): object {
    let copy = {};
    let propCounter = 0;
    if(depth === 0) return copy;
    
    try{
      for(let prop of Object.getOwnPropertyNames(source)) {
        if(typeof source[prop] === 'object' && source[prop] !== null) {
          let propObjCopy = this.createDeepCopy(source[prop], depth - 1);
          copy[prop] = propObjCopy;
        }
        else {
          copy[prop] = source[prop];
        }

        propCounter += 1;
        if(propCounter === this.messageObjectWidth) return copy;
      }
    }
    catch(error){
      debugger
    }
    
    return copy;
  }

  private createEventDeepCopy(source: object, depth: number): object {
    let copy = {};
    let propCounter = 0;
    if(depth === 0) return copy;
    
    try{
      for(let prop in source) {
        if(typeof source[prop] === 'object' && source[prop] !== null) {
          let propObjCopy = this.createEventDeepCopy(source[prop], depth - 1);
          copy[prop] = propObjCopy;
        }
        else {
          copy[prop] = source[prop];
        }

        propCounter += 1;
        if(propCounter === this.messageObjectWidth) return copy;
      }
    }
    catch(error){
      debugger
    }
    
    return copy;
  }

  private getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}

/* private createReferencesArray(obj: object, depth: number): object[] {
  let refArr = [];
  for(let value of Object.values(obj)) {
    if(typeof value === 'object') refArr.push(value);
  }

  let nestedRefArr = [];
  if(depth > 0 && refArr.length !== 0) {
    refArr.forEach(element => {
      let nested = this.createReferencesArray(element, depth - 1);
      if(nested.length !== 0) nestedRefArr.push(...nested);
    });
    refArr.push(...nestedRefArr);
  }

  return refArr;
} */
