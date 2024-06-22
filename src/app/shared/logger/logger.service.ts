import { Injectable } from '@angular/core';
import { LogLevel } from './LogLevel.enum';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
private level:LogLevel = 0;

  constructor() { 
    this.level =  LogLevel[environment.logLevel as keyof typeof LogLevel]
    console.log(`log level set to  ${environment.logLevel}`);
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeLog(msg, LogLevel.Debug, optionalParams);
}

info(msg: string, ...optionalParams: any[]) {
    this.writeLog(msg, LogLevel.Info, optionalParams);
}

warn(msg: string, ...optionalParams: any[]) {
    this.writeLog(msg, LogLevel.Warn, optionalParams);
}

error(msg: string, ...optionalParams: any[]) {
    this.writeLog(msg, LogLevel.Error, optionalParams);
}

private writeLog(msg: string, level: LogLevel, params: any[]) {
  if (level >= this.level) {
      let value: string  = new Date().toISOString();
      value += " - Message: " + msg;
      if (params&&params.length) {
          value += " - Info: " + this.formatParams(params);
      }
      console.log(value);
  }
}

 
private formatParams(params: any[]): string {
  let ret: string = params.join(",");
  
  // Is there at least one object in the array?
  if (params.some(p => typeof p == "object")) {
      ret = "";
      
      // Build comma-delimited string
      for (let item of params) {
          ret += JSON.stringify(item) + ",";
      }
  }
  return ret;
}


}
