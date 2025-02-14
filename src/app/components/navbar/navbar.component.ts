import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class NavbarComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  isAuthenticated = false;
  user: any = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated = false;
    this.user = null;
  }

  async ngOnInit() {
    this.isAuthenticated = await this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      try {
        this.user = await this.authService.getUser();
        if (!this.user) {
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Error al obtener usuario', error);
        this.isAuthenticated = false;
        this.user = null;
      }
    }
  }

  async login() {
    this.isAuthenticated = false;
    this.user = null;
    
    try {
      await this.authService.login();
    } catch (error) {
      console.error('Error durante el login:', error);
      this.isAuthenticated = false;
      this.user = null;
    }
  }

  async logout() {
    this.isAuthenticated = false;
    this.user = null;
    this.dropdownOpen = false;
    
    await this.authService.logout();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  ngOnDestroy() {
    this.isAuthenticated = false;
    this.user = null;
    this.dropdownOpen = false;
  }
}