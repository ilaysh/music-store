import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from './model';
import { NavigationStart, Router } from '@angular/router';
import { AlertService } from './alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent  implements OnInit, OnDestroy{
  @Input() id = 'alert';
  @Input() fade = true;
  @Input() duration = 3000;

  public alerts: Alert[] = [];
  private alertSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe({next:(alert) => {
        // clear alerts when an empty alert is received
        if (!alert.msg) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange == true);

          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach(x => x.keepAfterRouteChange = false);
          return;
        }

        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          let duration = alert.duration || this.duration
          // setTimeout(() => this.removeAlert(alert), duration);
        }
      }});

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert): void {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert))
      return;

    //if (this.fade) {
    // fade out alert
    let openAlert = this.alerts.find(x => x === alert) || null;
    if (openAlert)
      openAlert.isOpen = false;
    // remove alert after faded out
    setTimeout(() => {
      this.alerts = this.alerts.filter(x => x !== alert);
    }, 250);
    //}
    //else {
    //  // remove alert
    //  this.alerts = this.alerts.filter(x => x !== alert);
    //}
  }

  public cssClass(alert: Alert) {
    if (!alert) return;

    let classes = ['snackbar']// ['alert', 'alert-dismissable'];
    let alertTypeClass = {
      [AlertType.Auto]: 'alert-info',
      [AlertType.Success]: 'alert-success bg-success',
      [AlertType.Error]: 'alert-danger bg-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning'
    }
    classes.push(alertTypeClass[AlertType.Auto]);

    if (alert.isOpen)
      classes.push('active');

    if (alert.fade) {
      classes.push('fade');
    }
    return classes.join(' ');
  }
}
