import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,  // Add this if you're using Angular 16+
  imports: [
    LoginComponent,
    TaskListComponent,
    RouterModule,
    CommonModule
  ],  // Add this if you're using Angular 16+
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'task-manager';
  isLoggedIn = false;

  constructor(private router: Router) {}

  onLoginSuccess() {
    this.isLoggedIn = true;
  }

  onLogout() {
    this.isLoggedIn = false;
  }
} 