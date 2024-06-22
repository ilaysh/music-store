import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user$: Observable<string>;
  constructor(private service: LoginService) {
      this.user$ = this.service.currentUser;
  }

  ngOnInit(): void { }

  logout() {
    this.service.logout();
  }
}