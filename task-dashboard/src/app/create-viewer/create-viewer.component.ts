import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedUserService } from '../shared-user.service';

@Component({
  selector: 'app-create-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-viewer.component.html',
  styleUrl: './create-viewer.component.css'
})
export class CreateViewerComponent {
  username = '';
  password = '';
  message = '';

  constructor(private userService: SharedUserService) {}

  createViewer() {
    if (!this.username || !this.password) {
      this.message = 'Username and password are required.';
      return;
    }
    this.userService.addUser({ username: this.username, password: this.password, role: 'viewer' });
    this.message = `Viewer '${this.username}' created.`;
    this.username = '';
    this.password = '';
  }
}
