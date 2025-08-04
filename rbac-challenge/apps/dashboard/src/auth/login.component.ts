import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="login()">
      <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
      <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <div *ngIf="error" style="color:red">{{ error }}</div>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = 'Login failed'
    });
  }
}