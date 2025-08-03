import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';
import { Observable, of } from 'rxjs';
// MOCK MODE: set to true to use in-memory data
const MOCK_MODE = true;

// Define the Task interface if not already defined or imported
export interface Task {
  id: number;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  category?: string;
  // Add other fields as needed
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private mockTasks: Task[] = [
    { id: 1, title: 'Sample Task 1', status: 'Todo' },
    { id: 2, title: 'Sample Task 2', status: 'In Progress' },
    { id: 3, title: 'Sample Task 3', status: 'Done' }
  ];
  private nextId = 4;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    if (MOCK_MODE) {
      return of(this.mockTasks);
    }
    return this.http.get<Task[]>(`${environments.apiUrl}/tasks`);
  }

  createTask(data: { title: string, category?: string }) {
    if (MOCK_MODE) {
      const newTask: Task = {
        id: this.nextId++,
        title: data.title,
        status: 'Todo',
        category: data.category
      };
      this.mockTasks.push(newTask);
      return of(newTask);
    }
    return this.http.post(`${environments.apiUrl}/tasks`, data);
  }

  updateTask(id: number, updates: Partial<Task>) {
    if (MOCK_MODE) {
      const idx = this.mockTasks.findIndex(t => t.id === id);
      if (idx > -1) {
        this.mockTasks[idx] = { ...this.mockTasks[idx], ...updates };
      }
      return of(this.mockTasks[idx]);
    }
    return this.http.put(`${environments.apiUrl}/tasks/${id}`, updates);
  }

  deleteTask(id: number) {
    if (MOCK_MODE) {
      this.mockTasks = this.mockTasks.filter(t => t.id !== id);
      return of({});
    }
    return this.http.delete(`${environments.apiUrl}/tasks/${id}`);
  }
}
