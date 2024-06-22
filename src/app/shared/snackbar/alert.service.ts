import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './model';

@Injectable({ providedIn: 'root' })
export class AlertService {

  constructor() { }

  private subject = new Subject<Alert>();
  private defaultId = 'alert';

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  // convenience methods
  success(msg: string, options?: any) {
    this.open(new Alert({ ...options, type: AlertType.Success, msg }));
  }

  error(msg: string, options?: any) {
    this.open(new Alert({ ...options, type: AlertType.Error, msg }));
  }

  info(msg: string, options?: any) {
    this.open(new Alert({ ...options, type: AlertType.Info, msg }));
  }

  warn(msg: string, options?: any) {
    this.open(new Alert({ ...options, type: AlertType.Warning, msg }));
  }


  // main alert method    
  open(alert: Alert) {
    if (!alert.id)
      alert.id = alert.id || this.defaultId;

    if (!alert.type)
      alert.type = alert.result ? AlertType.Success : AlertType.Error;

    this.clear(alert.id);
    alert.isOpen = true;
    this.subject.next(alert);
  }
  
  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}
