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
      if (this.password !== this.retypedPassword) {
        alert('Passwords do not match');
        return;
      }
      if (!this.email || !this.password || !this.username){
        alert('You must enter all the information');
        return;
      }
      const result: { message: string } = await this.userService.register(this.username, this.email, this.password);
      if (result.message === 'success') {
        window.location.reload();
      } else {
        alert(result.message);
      }
      console.log('Register:', result);
    } else {
      const result: { message: string, token: string } = await this.userService.login(this.email, this.password);
      console.log('Login:', result);
      if (result.message === 'success') {
        document.cookie = `TOKENS=${result.token}; path=/;`;
        this.router.navigate(['/tasks']);
      } else {
        alert(result.message);
      }
    }
  }
}