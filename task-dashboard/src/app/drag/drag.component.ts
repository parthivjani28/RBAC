
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../navbar/navbar.component';
import { WelcomeComponent } from '../welcome/welcome.component';

import { CreateUserComponent } from '../create-user/create-user.component';
import { SharedUserService, User } from '../shared-user.service';
import { SharedTaskService, Task as SharedTask } from '../shared-task.service';


interface Task {
  text: string;
  isEditing: boolean;
  assignee?: string;
}

@Component({
  selector: 'app-drag',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, NavbarComponent, WelcomeComponent, CreateUserComponent],
  templateUrl: './drag.component.html',
  styleUrl: './drag.component.css',
})
export class DragComponent {
  assignee = '';
  users: User[] = [];
  userName: string = 'owner'; // Replace with actual user logic if available
  todo: SharedTask[] = [];
  inProgress: SharedTask[] = [];
  done: SharedTask[] = [];
  newTask: string = '';
  progressByUser: { [username: string]: { total: number; done: number } } = {};
  totalTasks: number = 0;
  pendingTasks: number = 0;
  isDarkMode = false;

  constructor(private userService: SharedUserService, private taskService: SharedTaskService) {
    this.users = this.userService.getAll();
    this.loadTasks();
    this.progressByUser = this.taskService.getProgressByUser();
    this.updateTaskCounts();
    this.isDarkMode = localStorage.getItem('ownerDarkMode') === 'true';
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('ownerDarkMode', this.isDarkMode.toString());
  }

  getConnectedDropLists(currentId: string): string[] {
    const allIds = ['todoList', 'inProgressList', 'doneList'];
    return allIds.filter(id => id !== currentId);
  }

  loadTasks() {
    const tasks = this.taskService.getAllTasks().filter(t => t.assignedBy === this.userName);
    this.todo = tasks.filter(t => t.status === 'todo');
    this.inProgress = tasks.filter(t => t.status === 'inProgress');
    this.done = tasks.filter(t => t.status === 'done');
    this.progressByUser = this.taskService.getProgressByUser();
    this.updateTaskCounts();
  }

  drop(event: CdkDragDrop<SharedTask[]>) {
    // This method is now compatible with the template (one argument)
    // You may want to infer the status from the drop target if needed
    this.loadTasks();
  }
  updateTaskCounts() {
    this.totalTasks = this.todo.length + this.inProgress.length + this.done.length;
    this.pendingTasks = this.todo.length + this.inProgress.length;
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

  deleteTask(list: SharedTask[], index: number) {
    list.splice(index, 1);
  }

  editTask(task: SharedTask) {
    task.isEditing = true;
  }

  saveTask(task: SharedTask) {
    task.text = task.text.trim();
    if (task.text) {
      task.isEditing = false;
    }
  }

  cancelEdit(task: SharedTask) {
    task.isEditing = false;
  }

}