import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);


  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isPosting = signal(false);
  hasError = signal(false);

  onSubmit() {
    if(this.isPosting()){
      return;
    }

    if( this.registerForm.invalid ){
      this.hasError.set(true);

      setTimeout( () => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    this.isPosting.set(true);

    const { fullName = '', email = '', password = ''} = this.registerForm.value;

    console.log({email, password});

    this.authService.register(fullName!, email!, password!).subscribe({
      next: isAuthenticated => {
        this.isPosting.set(false);

        if(isAuthenticated){
          this.router.navigateByUrl('/');
          return;
        }
      },
      error: () => {
        this.isPosting.set(false);
        this.hasError.set(true);
        setTimeout( () => {
          this.hasError.set(false);
        }, 2000);
      }
    });
  }
}
