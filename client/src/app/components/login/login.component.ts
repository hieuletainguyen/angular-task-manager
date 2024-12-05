import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  email: string = '';

  constructor(private router: Router, private userService: UserService) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.username = '';
    this.password = '';
    this.retypedPassword = '';
    this.email = '';
  }

  async onSubmit() {
    if (this.isRegisterMode) {
      // fetch - register
      if (this.password !== this.retypedPassword) {
        alert('Passwords do not match');
        return;
      }
      const result: { message: string } = await this.userService.register(this.username, this.email, this.password);
      if (result.message === 'success') {
        this.router.navigate(['/login']);
      } else {
        alert(result.message);
      }
      console.log('Register:', result);
    } else {
      // fetch - login
      const result: { message: string } = await this.userService.login(this.email, this.password);
      console.log('Login:', result);
      if (result.message === 'success') {
        this.router.navigate(['/tasks']);
      } else {
        alert(result.message);
      }
    }
  }
}