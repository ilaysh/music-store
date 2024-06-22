import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userModel } from '../userModel';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../shared/snackbar/alert.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private service: LoginService = inject(LoginService);
  private alertService: AlertService = inject(AlertService);
  isSubmitted: boolean = false;

  registrationForm: FormGroup;
  errorMsg: string = '';
  constructor() {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[^\s]+$/)]],
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    this.errorMsg ='';
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      this.errorMsg = 'form fields are invalid';
      // todo: check each field
      return;
    }
    const user: userModel = this.registrationForm.value;
    // mock db
    this.service.isUserNameTaken(user).subscribe({
      next: (res) => {
        if (res) {
          this.errorMsg = "Username already taken";
        }
        else
          this.service.createUser(user).subscribe({
            next: (res) => {
              if (res){
                this.alertService.success('User created successfully');
              }
              else{
                this.alertService.success('Failed to create user');
              }
            },
          })
      }, error: (err) => {
        this.alertService.error("an error occurred");
      }

    });
  }

}
