import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "http://localhost:9897";

  constructor(private http: HttpClient) { }

  async getTasks(): Promise<Task[]> {
    const data = await fetch(this.apiUrl + "/tasks", {
      credentials: 'include'
    });
    return data.json();
  }

  async addTask(task: Task): Promise<Task> {
    const data = await fetch(this.apiUrl + "/tasks", {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(task)
    });
    return data.json();
  }

  async updateTask(task: Task): Promise<Task> {
    const data = await fetch(this.apiUrl + "/tasks/" + task.id, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(task)
    });
    return data.json();
  }

  async deleteTask(id: number): Promise<void> {
    const data = await fetch(this.apiUrl + "/tasks/" + id, {
      method: 'DELETE',
      credentials: 'include'
    });
    return data.json();
  }
}