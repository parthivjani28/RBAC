
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedUserService } from '../shared-user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  username = '';
  password = '';
  role = 'admin';
  message = '';

  constructor(private userService: SharedUserService) {}

  createUser() {
    if (!this.username || !this.password) {
      this.message = 'Username and password are required.';
      return;
    }
    this.userService.addUser({ username: this.username, password: this.password, role: this.role as 'admin' | 'viewer' });
    this.message = `User '${this.username}' created with role '${this.role}'.`;
    this.username = '';
    this.password = '';
    this.role = 'admin';
  }
}
