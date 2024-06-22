import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/snackbar/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: LoginService,
    private alert: AlertService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['']
    });
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.alert.error('invalid details')
      return
    }
    const user = this.loginForm.value;
    this.service.login(user).subscribe({
      next: (res) => {
        if (res) {
          this.alert.success('login successfull')
          this.router.navigate(['/disks']);
        } else
          this.errorMessage = 'Invalid username or password';
      }, error: (err) => this.alert.error('Failed to login')
    })

  }
}
