import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  retypedPassword: string = '';
  isRegisterMode: boolean = false;

  constructor(private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.username = '';
    this.password = '';
    this.retypedPassword = '';
  }

  onSubmit() {
    if (this.isRegisterMode) {
      // fetch - register
      if (this.password !== this.retypedPassword) {
        alert('Passwords do not match');
        return;
      }
      
    } else {
      // fetch - login
      console.log('Login:', this.username, this.password);
      // Simulate successful login
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/tasks']);
    }
  }
}