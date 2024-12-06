import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AuthGuard } from './components/auth.guard';
import { NoAuthGuard } from './components/no-auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { 
      path: 'login', 
      component: LoginComponent, 
      canActivate: [NoAuthGuard]
    },
    { 
      path: 'tasks', 
      component: TaskListComponent,
      canActivate: [AuthGuard]  // This will protect the route
    }
];
