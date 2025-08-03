import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  newTaskTitle = '';
  editMode: { [taskId: number]: boolean } = {};
  editedTitle: { [taskId: number]: string } = {};

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.todo = tasks.filter(t => t.status === 'Todo');
      this.inProgress = tasks.filter(t => t.status === 'In Progress');
      this.done = tasks.filter(t => t.status === 'Done');
    });
  }

  enableEdit(task: Task) {
    this.editMode[task.id] = true;
    this.editedTitle[task.id] = task.title;
  }

  saveEdit(task: Task) {
    const newTitle = this.editedTitle[task.id];
    if (newTitle && newTitle !== task.title) {
      this.taskService.updateTask(task.id, { title: newTitle }).subscribe(() => {
        task.title = newTitle;
        this.editMode[task.id] = false;
      });
    } else {
      this.editMode[task.id] = false;
    }
  }

  deleteTask(task: Task) {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe(() => this.ngOnInit());
    }
  }

  addTask(): void {
    const newTask = { title: this.newTaskTitle, status: 'Todo' };
    this.taskService.createTask(newTask).subscribe(() => {
      this.ngOnInit();
      this.newTaskTitle = '';
    });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      this.taskService.updateTask(task.id, { status: newStatus as 'Todo' | 'In Progress' | 'Done' }).subscribe(() => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      });
    }
  }
}
