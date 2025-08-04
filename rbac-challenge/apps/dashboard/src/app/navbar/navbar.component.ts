import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe]
})
export class NavbarComponent {
  userName = 'John Doe'; // Replace with actual user logic
  get currentTime() {
    return new Date();
  }
  clockOut() {
    // Add your clock out logic here
    alert('Clocked out!');
  }
}
