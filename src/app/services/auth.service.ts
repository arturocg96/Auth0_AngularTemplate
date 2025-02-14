// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Permissions } from '../core/auth/models/permissions.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPermissions: string[] = [];

  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {
    this.isAuthenticated().then(isAuth => {
      if (isAuth) {
        this.getToken().then(() => {
          this.loadUserPermissions();
        });
      }
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return (await firstValueFrom(this.auth0.isAuthenticated$)) ?? false;
  }

  async getUser(): Promise<any> {
    return await firstValueFrom(this.auth0.user$);
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await firstValueFrom(this.auth0.getAccessTokenSilently());     
  
      const payload = JSON.parse(atob(token.split('.')[1])); 
      console.log('Payload del Token:', payload);
  
      const permissions = payload['permissions'] || [];
      if (permissions.length > 0) {
        console.log('Permisos en el token:', permissions);
        this.userPermissions = permissions;
      } else {
        console.warn('⚠️ Los permisos NO están en el token. Revisa la configuración en Auth0.');
      }

      const roles = payload['https://roles0auth.com/roles'];
      if (roles) {
        console.log('Roles en el token:', roles);
      } else {
        console.warn('⚠️ Los roles NO están en el token. Revisa la configuración en Auth0.');
      }
  
      return token;
    } catch (error) {
      console.error('Error al obtener el token', error);
      return null;
    }
  }

  private async loadUserPermissions() {
    const token = await this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userPermissions = payload['permissions'] || [];
    }
  }

  hasPermission(permission: keyof typeof Permissions): boolean {
    return this.userPermissions.includes(Permissions[permission]);
  }

  hasAnyPermission(permissions: (keyof typeof Permissions)[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: (keyof typeof Permissions)[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  isRoot(): boolean {
    return this.hasAllPermissions([
      'ReadAnyUser',
      'WriteAnyUser',
      'DeleteAnyUser',
      'ManageRoles',
      'ManageSettings',
      'AccessAdminPanel',
      'ManageOrganizations',
      'ViewMetrics',
      'ManageApiKeys'
    ]);
  }

  isAdmin(): boolean {
    return this.hasAllPermissions([
      'ReadAssignedUsers',
      'WriteAssignedUsers',
      'AccessAdminPanel',
      'ViewMetrics',
      'ManageContent'
    ]);
  }

  login() {
    this.auth0.loginWithRedirect();
  }

  logout() {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}