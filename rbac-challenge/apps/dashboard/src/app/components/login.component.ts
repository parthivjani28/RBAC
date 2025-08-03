import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">Login</h2>
      <form (ngSubmit)="login()">
        <input class="border p-2 mb-2 w-full" [(ngModel)]="username" name="username" placeholder="Username" />
        <input class="border p-2 mb-2 w-full" [(ngModel)]="password" name="password" type="password" placeholder="Password" />
        <button class="bg-blue-500 text-white px-4 py-2 w-full">Login</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  username = 'hello';
  password = 'hello';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => alert('Invalid credentials'),
    });
  }
}
