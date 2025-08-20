import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get(`${environments.apiUrl}/tasks`);
  }

  createTask(task: { title: string; description: string }) {
    return this.http.post(`${environments.apiUrl}/tasks`, task);
  }

  // Add update, delete, etc. as needed
}