

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedUserService } from '../shared-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router, private userService: SharedUserService) {}

  login() {
    // Hardcoded users
    const users = [
      { username: 'owner', password: 'ownerpass', role: 'owner' },
      { username: 'admin', password: 'adminpass', role: 'admin' },
      { username: 'viewer', password: 'viewerpass', role: 'viewer' },
    ];
    let user = users.find(u => u.username === this.username && u.password === this.password);
    if (!user) {
      // Check shared users (created by owner)
      const sharedUsers = this.userService.getAll();
      const found = sharedUsers.find(u => u.username === this.username && u.password === this.password);
      if (found) {
        user = { username: found.username, password: found.password, role: found.role };
      }
    }
    if (user) {
      this.error = '';
      this.router.navigate([`/dashboard-${user.role}`]);
    } else {
      this.error = 'Invalid username or password';
    }
  }
}