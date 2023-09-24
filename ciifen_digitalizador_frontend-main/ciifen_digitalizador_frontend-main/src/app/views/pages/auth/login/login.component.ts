import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  AuthResponseData,
  AuthService,
} from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  returnUrl: any;
  username: any;
  password: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onLogIn() {
    const username = this.username;
    const password = this.password;

    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.login(username, password);

    authObs.subscribe({
      next: (data) => {
        this.router.navigate(['/pluviogramas']);
      },
      error: (error) => {
        Swal.fire('Hay un Problema', error.error, 'error');
      },
    });
  }

  // async onLogIn() {
  //   (await this.authService.login(this.email, this.password)).subscribe(() => {
  //     console.log('segundo');

  //     this.router.navigate(['/dashboard']);
  //   });
  // }
}
