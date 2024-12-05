import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'] // Fixed typo from styleUrl to styleUrls
})
export class AdminComponent {
  userAccounts = []; // Array to hold user accounts
  searchTerm = ''; // Variable for search input

  constructor() {
    // Sample data for demonstration
    this.userAccounts = [];
  }

  modifyUser(id: number) {
    // Logic to modify user (e.g., open a modal)
    console.log(`Modify user with id: ${id}`);
  }
}