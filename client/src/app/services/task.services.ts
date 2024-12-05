import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "http://localhost:9897";

  constructor() { }

  async getTasks(): Promise<{ message: string, result: Task[] }> {
    const data = await fetch(this.apiUrl + "/tasks/get-tasks", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.json();
  }

  async getTask(id: number): Promise<{ message: string, result: Task }> {
    const data = await fetch(this.apiUrl + "/tasks/get-task/" + id, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.json();
  }

  async addTask(task: Task): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/tasks/add-task", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    return data.json();
  }

  async updateTask(task: Task): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/tasks/modify-task/" + task.id, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    return data.json();
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/tasks/delete-task/" + id, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.json();
  }
}