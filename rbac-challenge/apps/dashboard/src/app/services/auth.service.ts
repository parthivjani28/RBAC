import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }) {
    return this.http.post<{ access_token: string }>(`${environments.apiUrl}/auth/login`, credentials)
      .pipe(tap(res => {
        localStorage.setItem('token', res.access_token);
      }));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
