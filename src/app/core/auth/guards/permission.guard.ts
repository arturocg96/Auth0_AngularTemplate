import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const authenticated = await this.auth.isAuthenticated();
    
    if (!authenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredPermission = route.data['permission'];
    if (!requiredPermission) return true;

    const token = await this.auth.getToken();
    if (!token) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const permissions = payload['permissions'] || [];

    if (!permissions.includes(requiredPermission)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}