
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedUserService, User } from '../shared-user.service';
import { SharedTaskService, Task as SharedTask } from '../shared-task.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CreateViewerComponent } from '../create-viewer/create-viewer.component';

interface Task {
  text: string;
  isEditing: boolean;
  assignee?: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, NavbarComponent, CreateViewerComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {
  newTask = '';
  assignee = '';
  todo: SharedTask[] = [];
  inProgress: SharedTask[] = [];
  done: SharedTask[] = [];
  viewers: User[] = [];
  userName = 'admin'; // Replace with real user logic if needed
  isDarkMode = false;

  constructor(private userService: SharedUserService, private taskService: SharedTaskService) {
    this.viewers = this.userService.getViewers();
    this.loadTasks();
    this.isDarkMode = localStorage.getItem('adminDarkMode') === 'true';
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('adminDarkMode', this.isDarkMode.toString());
  }

  loadTasks() {
    const tasks = this.taskService.getAllTasks().filter(t => t.assignedBy === this.userName);
    this.todo = tasks.filter(t => t.status === 'todo');
    this.inProgress = tasks.filter(t => t.status === 'inProgress');
    this.done = tasks.filter(t => t.status === 'done');
  }

  getConnectedDropLists(currentId: string): string[] {
    const allIds = ['todoList', 'inProgressList', 'doneList'];
    return allIds.filter(id => id !== currentId);
  }

  addTask() {
    const trimmed = this.newTask.trim();
    if (trimmed && this.assignee) {
      const task: SharedTask = {
        text: trimmed,
        isEditing: false,
        assignee: this.assignee,
        assignedBy: this.userName,
        status: 'todo'
      };
      this.taskService.addTask(task);
      this.loadTasks();
      this.newTask = '';
      this.assignee = '';
    }
  }

  drop(event: CdkDragDrop<SharedTask[]>) {
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
    this.loadTasks();
  }

  deleteTask(list: Task[], index: number) {
    list.splice(index, 1);
  }

  editTask(task: Task) {
    task.isEditing = true;
  }

  saveTask(task: Task) {
    task.text = task.text.trim();
    if (task.text) {
      task.isEditing = false;
    }
  }

  cancelEdit(task: Task) {
    task.isEditing = false;
  }
}
