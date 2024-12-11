import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [LoginComponent, RouterModule], 
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'task-manager';
} 