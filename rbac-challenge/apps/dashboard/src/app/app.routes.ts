// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DragComponent } from './drag/drag.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardViewerComponent } from './dashboard-viewer/dashboard-viewer.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard-owner', component: DragComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'dashboard-viewer', component: DashboardViewerComponent },
];

export default routes;

