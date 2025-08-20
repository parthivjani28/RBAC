import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { DragComponent } from './drag/drag.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';

// This file is no longer needed since bootstrapping is handled via bootstrapApplication in main.ts.
// You can safely delete this file or keep it empty if not used elsewhere.
