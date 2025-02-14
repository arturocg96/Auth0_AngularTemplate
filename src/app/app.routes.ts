import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorComponent } from './components/error/error.component';
import { TestComponent } from './pages/test/test.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: ProfileComponent },
    {path: 'test', component: TestComponent},
    { path: 'error', component: ErrorComponent }
];
