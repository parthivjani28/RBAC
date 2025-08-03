import { Route } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { TasksComponent } from './components/tasks.component';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
