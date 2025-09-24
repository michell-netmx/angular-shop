import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if(this.isPosting()){
      return;
    }
    if( this.loginForm.invalid ){
      this.hasError.set(true);
      setTimeout( () => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    this.isPosting.set(true);

    const { email = '', password = ''} = this.loginForm.value;

    console.log({email, password});

    this.authService.login(email!, password!).subscribe({
      next: isAuthenticated => {
        this.isPosting.set(false);

        if(isAuthenticated){

          const user = this.authService.user();

          if ( user?.roles && user.roles.find(userRole => userRole === 'admin') ) {
            this.router.navigateByUrl('/admin');
            return;
          }

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
