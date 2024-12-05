import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    id: 0,
    title: '',
    description: '',
    isCompleted: false,
    priority: 'low',
    dueDate: new Date()
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    // fetch
    const result = await this.taskService.getTasks();
    console.log(result);
    if (result.message === "success") {
      this.tasks = result.result;
    }
  }

  async addTask() {
    // fetch
    await this.taskService.addTask(this.newTask);
    this.loadTasks();
    this.resetNewTask();
  }

  async toggleComplete(task: Task) {
    task.isCompleted = !task.isCompleted;
    // fetch
    await this.taskService.updateTask(task);
    this.loadTasks();
  }

  async deleteTask(id: number) {
    // fetch 
    await this.taskService.deleteTask(id);
    this.loadTasks();
  }

  private resetNewTask() {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      isCompleted: false,
      priority: 'low',
      dueDate: new Date()
    };
  }
}