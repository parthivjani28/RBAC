import { Injectable } from '@angular/core';

export interface Task {
  text: string;
  isEditing: boolean;
  assignee?: string;
  assignedBy?: string;
  status: 'todo' | 'inProgress' | 'done';
}

@Injectable({ providedIn: 'root' })
export class SharedTaskService {
  private tasks: Task[] = [];

  addTask(task: Task) {
    this.tasks.push(task);
  }

  getTasksForUser(username: string): Task[] {
    return this.tasks.filter(t => t.assignee === username);
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  updateTaskStatus(task: Task, status: 'todo' | 'inProgress' | 'done') {
    const t = this.tasks.find(
      x => x.text === task.text && x.assignee === task.assignee && x.assignedBy === task.assignedBy
    );
    if (t) t.status = status;
  }

  getProgressByUser(): { [username: string]: { total: number; done: number } } {
    const progress: { [username: string]: { total: number; done: number } } = {};
    for (const t of this.tasks) {
      if (!t.assignee) continue;
      if (!progress[t.assignee]) progress[t.assignee] = { total: 0, done: 0 };
      progress[t.assignee].total++;
      if (t.status === 'done') progress[t.assignee].done++;
    }
    return progress;
  }
}
