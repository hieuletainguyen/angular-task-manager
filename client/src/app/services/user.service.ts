import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.backendUrl;

  constructor() { }

  async login(email: string, password: string): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/user/auth", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return data.json();
  }

  async register(username: string, email: string, password: string): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/user/register-user", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    return data.json();
  }

  async logout(): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/user/logout", {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.json();
  }

  async getUser(): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/user/decode-token", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.json();
  }

  async updateUser(user: User): Promise<{ message: string }> {
    const data = await fetch(this.apiUrl + "/user/account", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return data.json();
  }


}
