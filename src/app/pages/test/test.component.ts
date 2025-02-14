import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  isAuthenticated = false;
  publicResult: any = null;
  privateResult: any = null;
  error: string = '';

  constructor(
    public auth: AuthService,  // Cambiado a público para usarlo en el template
    private apiService: ApiService
  ) {
    this.checkAuth();
  }

  private async checkAuth() {
    this.isAuthenticated = await this.auth.isAuthenticated();
  }

  testPublic() {
    this.error = '';
    this.apiService.testPublicEndpoint().subscribe({
      next: (result) => {
        this.publicResult = result;
        console.log('Respuesta del endpoint público:', result);
      },
      error: (err) => {
        this.error = 'Error en endpoint público: ' + err.message;
        console.error('Error en endpoint público:', err);
      }
    });
  }

  testPrivate() {
    this.error = '';
    this.apiService.testPrivateEndpoint().subscribe({
      next: (result) => {
        this.privateResult = result;
        console.log('Respuesta del endpoint privado:', result);
      },
      error: (err) => {
        this.error = 'Error en endpoint privado: ' + err.message;
        console.error('Error en endpoint privado:', err);
      }
    });
  }
}