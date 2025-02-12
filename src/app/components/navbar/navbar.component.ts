import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  isAuthenticated = false;
  user: any = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      this.isAuthenticated = await this.authService.isAuthenticated();
      this.user = await this.authService.getUser();
      
    } catch (error) {
      console.error('Error al obtener autenticación o usuario', error);
      this.isAuthenticated = false;
      this.user = null;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  login() {
    
    this.authService.login();
   
    
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {}
}
