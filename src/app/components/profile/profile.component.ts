import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PermissionsService } from '../../services/permissions-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  profileJson: string | null = null;
  token: string | null = null;
  roles: string[] = [];
  permissions: string[] = [];
  showToken = false;

  constructor(
    private authService: AuthService,
    private permissionsService: PermissionsService
  ) {}

  async ngOnInit() {
    try {
      this.user = await this.authService.getUser();
      this.profileJson = JSON.stringify(this.user, null, 2);
      
      this.token = await this.authService.getToken();
      this.roles = this.permissionsService.getRoles();
      this.permissions = this.permissionsService.getPermissions();
    } catch (error) {
      console.error('Error al obtener los datos del usuario', error);
    }
  }
}