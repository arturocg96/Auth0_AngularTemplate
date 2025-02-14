import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private userPermissions$ = new BehaviorSubject<string[]>([]);
  private userRoles$ = new BehaviorSubject<string[]>([]);

  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const isAuth = await this.isAuthenticated();
    if (isAuth) {
      console.log("🔹 Usuario autenticado, cargando permisos y roles...");
      await this.loadUserPermissionsAndRoles();
    } else {
      console.warn("⚠️ Usuario no autenticado, no se cargan permisos ni roles.");
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return (await firstValueFrom(this.auth0.isAuthenticated$)) ?? false;
  }

  async getUser(): Promise<any> {
    return await firstValueFrom(this.auth0.user$);
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token; // Evita pedirlo de nuevo si ya está guardado

    try {
      this.token = await firstValueFrom(this.auth0.getAccessTokenSilently());
      console.log('🔑 Token obtenido:', this.token); 
      this.extractPermissionsAndRolesFromToken(this.token);
      return this.token;
    } catch (error) {
      console.error('Error al obtener el token', error);
      return null;
    }
  }

  private extractPermissionsAndRolesFromToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const permissions = payload['permissions'] || [];
      const roles = payload['https://roles0auth.com/roles'] || [];

      this.userPermissions$.next(permissions);
      this.userRoles$.next(roles);

      console.log('✅ Permisos en el token:', permissions);
      console.log('✅ Roles en el token:', roles);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  async loadUserPermissionsAndRoles() {
    if (!this.token) {
      await this.getToken();
    }
  }

  getPermissions(): string[] {
    return this.userPermissions$.value;
  }

  getRoles(): string[] {
    return this.userRoles$.value;
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
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
