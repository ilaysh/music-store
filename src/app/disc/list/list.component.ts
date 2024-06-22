import { Component, afterNextRender, inject } from '@angular/core';
import { DiscsService } from '../discs.service';
import { discModel } from '../disc.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { ListItemComponent } from '../list-item/list-item.component';
import { AlertService } from '../../shared/snackbar/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class DiscListComponent {
  service = inject(DiscsService);
  authService: AuthService = inject(AuthService);
  logger: LoggerService = inject(LoggerService);
  alertService: AlertService = inject(AlertService);

  searchHistory: string[] = [];
  searchTerm: string = '';
  searchBy: string[] = ['name', 'artist'] // todo: add more options
  albums: discModel[] = [];

  constructor() {
    // todo: this will use client side stuff
    afterNextRender(() => {
      this.authService.ensureToken().subscribe({
        next: (res) => {
        }, error: (err) => this.logger.error('failed to get token', err)
      })
    });

    this.searchHistory = this.service.getHistory()

  }

  search() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return;
    }
    this.service.searchDisc(this.searchTerm)
      .subscribe({
        next: (data) => {
          this.albums = data;
          this.searchHistory = this.service.getHistory();
        }
        , error: (err: HttpErrorResponse) => {
          this.albums = []
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
