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

  loadTasks() {
    // fetch
    this.taskService.getTasks().then(tasks => {
      this.tasks = tasks;
    });
  }

  addTask() {
    // fetch
    this.taskService.addTask(this.newTask).then(() => {
      this.loadTasks();
      this.resetNewTask();
    });
  }

  toggleComplete(task: Task) {
    task.isCompleted = !task.isCompleted;
    // fetch
    this.taskService.updateTask(task).then(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: number) {
    // fetch 
    this.taskService.deleteTask(id).then(() => {
      this.loadTasks();
    });
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