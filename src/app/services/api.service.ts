// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.auth0.apiUrl;

  testPublicEndpoint() {
    return this.http.get(`${this.baseUrl}/api/public`);
  }

  testPrivateEndpoint() {
    return this.http.get(`${this.baseUrl}/api/private/admin-only`);
  }
}