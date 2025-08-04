import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'viewer';
}

@Injectable({ providedIn: 'root' })
export class SharedUserService {
  private users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  getViewers(): User[] {
    return this.users.filter(u => u.role === 'viewer');
  }

  getAdmins(): User[] {
    return this.users.filter(u => u.role === 'admin');
  }

  getAll(): User[] {
    return this.users;
  }
}
