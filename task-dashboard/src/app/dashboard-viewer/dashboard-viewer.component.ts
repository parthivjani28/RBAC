import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { SharedTaskService, Task } from '../shared-task.service';

@Component({
  selector: 'app-dashboard-viewer',
  standalone: true,
  imports: [CommonModule, NavbarComponent, DragDropModule, FormsModule],
  templateUrl: './dashboard-viewer.component.html',
  styleUrl: './dashboard-viewer.component.css'
})
export class DashboardViewerComponent {
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  userName = '';
  isDarkMode = false;

  constructor(private taskService: SharedTaskService) {
    // For demo, set userName statically or get from auth
    this.userName = localStorage.getItem('viewer') || 'viewer';
    this.loadTasks();
    this.isDarkMode = localStorage.getItem('viewerDarkMode') === 'true';
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('viewerDarkMode', this.isDarkMode.toString());
  }

  loadTasks() {
    const tasks = this.taskService.getTasksForUser(this.userName);
    this.todo = tasks.filter(t => t.status === 'todo');
    this.inProgress = tasks.filter(t => t.status === 'inProgress');
    this.done = tasks.filter(t => t.status === 'done');
  }

  getConnectedDropLists(currentId: string): string[] {
    const allIds = ['todoList', 'inProgressList', 'doneList'];
    return allIds.filter(id => id !== currentId);
  }

  drop(event: CdkDragDrop<Task[]>) {
    // Infer status from the drop target id
    let status: 'todo' | 'inProgress' | 'done' = 'todo';
    if (event.container.id === 'inProgressList') status = 'inProgress';
    else if (event.container.id === 'doneList') status = 'done';
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      this.taskService.updateTaskStatus(task, status);
    }
  }

  get progress() {
    const total = this.todo.length + this.inProgress.length + this.done.length;
    return total ? Math.round((this.done.length / total) * 100) : 0;
  }
}
