import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {
    this.isAuthenticated().then(isAuth => {
      if (isAuth) {
        this.getToken();
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
      console.log('Token:', token);
      return token;
    } catch (error) {
      console.error('Error al obtener el token', error);
      return null;
    }
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