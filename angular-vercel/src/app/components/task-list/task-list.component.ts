import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {
    title: '',
    description: '',
    isCompleted: false,
    priority: 'low',
    dueDate: new Date()
  };
  

  constructor(private router: Router,private taskService: TaskService, private userService: UserService) {}

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    // fetch
    const result = await this.taskService.getTasks();
    console.log("result of getTasks: ", result);
    if (result.message === "success") {
      this.tasks = result.result;
    }
  }

  async addTask() {
    // fetch
    console.log("This is new task: ",this.newTask);
    const result = await this.taskService.addTask(this.newTask);
    console.log(result);
    this.loadTasks();
    this.resetNewTask();
  }

  async toggleComplete(task: Task) {
    task.isCompleted = !task.isCompleted;
    // fetch
    const result = await this.taskService.updateTask(task);
    console.log("result of toggle complete: ", result)
    this.loadTasks();
  }

  async deleteTask(id: number) {
    // fetch 
    console.log("task id: ", id);
    const result = await this.taskService.deleteTask(id);
    console.log("result of delete task: ", result)
    this.loadTasks();
  }

  async toggleEditMode(task: Task) {
    if (task.isEditing) {
      // Save updated task to the server
      const result = await this.taskService.updateTask(task);
      if (result.message === 'success') {
        this.loadTasks();
      }
    }
    task.isEditing = !task.isEditing; // Toggle edit mode
  }

  async toggleEditModeCancel(task: Task) {
    task.isEditing = !task.isEditing;
  }

  async logout() {
    const result = await this.userService.logout();
    console.log(result)
    if (result.message === "success") {
      this.router.navigate(['/']);
    }
  }

  private resetNewTask() {
    this.newTask = {
      title: '',
      description: '',
      isCompleted: false,
      priority: 'low',
      dueDate: new Date()
    };
  }
}