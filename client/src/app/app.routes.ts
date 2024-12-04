import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '/',
        component: LoginComponent,
        title: "Login Page"
    },
    {
        path: '/tasks',
        component: TaskListComponent,
        title: "Task Page"
    }
];
