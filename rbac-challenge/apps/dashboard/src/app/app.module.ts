import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

// AppModule is not needed for standalone bootstrap, but if you want to keep it for legacy reasons, remove AppRoutingModule and declarations for LoginComponent and TasksComponent
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoginComponent } from './components/login.component';
import { TasksComponent } from './components/tasks.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    // AppComponent removed because it is now standalone
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
      DragDropModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  // No bootstrap array needed for standalone app
})
// AppModule is not used in standalone mode
export class AppModule { }
