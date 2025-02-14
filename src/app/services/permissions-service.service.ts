import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private permissions: string[] = [];
  private roles: string[] = [];

  constructor(private authService: AuthService) {
    this.initializePermissions();
  }

  private async initializePermissions(): Promise<void> {
    const token = await this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.permissions = payload['permissions'] || [];
        this.roles = payload[environment.auth0.urlRole] || [];
      } catch {
        this.permissions = [];
        this.roles = [];
      }
    }
  }

  getPermissions(): string[] {
    return this.permissions;
  }

  getRoles(): string[] {
    return this.roles;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}