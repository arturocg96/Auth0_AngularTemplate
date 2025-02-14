import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

type Auth0User = {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (await this.isAuthenticated()) {
      await this.getToken();
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return (await firstValueFrom(this.auth0.isAuthenticated$)) ?? false;
  }

  async getUser(): Promise<Auth0User> {
    return (await firstValueFrom(this.auth0.user$)) ?? {};
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;

    try {
      this.token = await firstValueFrom(this.auth0.getAccessTokenSilently({
        authorizationParams: {
          audience: environment.auth0.audience,
          scope: environment.auth0.scope
        }
      }));
      return this.token;
    } catch {
      return null;
    }
  }

  login(): void {
    this.auth0.loginWithRedirect({
      appState: { target: window.location.pathname }
    });
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: environment.auth0.redirectUri
      }
    });
  }
}