export interface AlertOptions {
  autoClose: boolean;
  keepAfterRouteChange: boolean;
  fade: boolean;
}

export class Alert {
  id: string = '';
  type: AlertType = AlertType.Auto;
  msg: string = '';
  result: boolean = false;
  returnURL: string = '';
  icon: string = "information";
  duration: number = 4000;
  isOpen: boolean = false;
  key: number = 0;
  autoClose: boolean = true;
  keepAfterRouteChange: boolean = true;
  fade: boolean = false;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }

  setAsError(errorMsg = "An error has occurred"): Alert {
    this.msg = errorMsg;
    this.result = false;
    this.type = AlertType.Error;
    return this;
  }

  setAsSuccess(successMsg: string): Alert {
    this.msg = successMsg;
    this.result = true;
    this.type = AlertType.Success;
    return this;
  }

}

export enum AlertType {
  Auto,
  Success,
  Error,
  Info,
  Warning
}
