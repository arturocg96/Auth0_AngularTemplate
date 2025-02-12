import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  profileJson: string | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      this.user = await this.authService.getUser();
      this.profileJson = JSON.stringify(this.user, null, 2);
    } catch (error) {
      console.error('Error al obtener el perfil del usuario', error);
    }
  }
}