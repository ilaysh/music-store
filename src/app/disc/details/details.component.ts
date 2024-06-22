import { Component, afterNextRender, inject } from '@angular/core';
import { discModel } from '../disc.model';
import { DiscsService } from '../discs.service';
import { AuthService } from '../../auth/auth.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { AlertService } from '../../shared/snackbar/alert.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  service = inject(DiscsService);
  authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);
  logger: LoggerService = inject(LoggerService);
  alertService: AlertService = inject(AlertService);

  public album: discModel | null = null;

  constructor() {
    // todo: this will use client side stuff
    afterNextRender(() => {
      this.authService.ensureToken().subscribe({
        next: (res) => {
          const albumId = this.route.snapshot.paramMap.get('id');
          this.fetchDetails(albumId);
        }, error: (err) => this.alertService.error('failed to get token')
      })
    });

  }


  fetchDetails(albumId: string | null) {
    if (!albumId) {
      this.alertService.error('No disc id');
      return;
    }

    this.service.getDisc(albumId).subscribe({
      next: (data) => {
        this.album = data;
        console.log(data)
      }, error: (err) => {
        if (err.status == 401) {
          this.authService.clearAuth();
          this.alertService.error('An error has occurred,please try again');
        }
        else
          this.alertService.error('An error has occurred');

      }
    });


  }
}
