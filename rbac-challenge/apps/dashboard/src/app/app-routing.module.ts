import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { TasksComponent } from './components/tasks.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
