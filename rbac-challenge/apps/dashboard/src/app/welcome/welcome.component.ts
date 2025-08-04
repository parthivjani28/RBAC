import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  @Input() userName: string = '';
  @Input() totalTasks: number = 0;
  @Input() pendingTasks: number = 0;

  get pendingPercentage(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.pendingTasks / this.totalTasks) * 100);
  }
}
