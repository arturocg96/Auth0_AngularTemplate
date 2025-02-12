import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {

  public error$: Observable<any> | null = null;
  public errorData: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.error$ = this.auth.error$;

    this.error$.subscribe((error) => {
      if (error) {
        this.errorData = error;
      } else {
        this.router.navigateByUrl('/'); 
      }
    });

    timer(5000).pipe(takeUntil(this.error$)).subscribe(() => {
      this.router.navigateByUrl('/'); 
    });
  }

}
