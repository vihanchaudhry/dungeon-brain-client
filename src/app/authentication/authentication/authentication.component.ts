import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  state = 'login';
  isLoading = false;
  private authenticationListener = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.state = url.toString();
    });
    this.authenticationListener = this.authenticationService
      .getStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authenticationListener.unsubscribe();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.state === 'login') {
      this.authenticationService.login(form.value.email, form.value.password);
    } else {
      this.authenticationService
        .register(form.value.email, form.value.password, form.value.displayName)
        .subscribe(response => {
          this.showMessage(response.message);
          this.router.navigateByUrl('/login');
        });
    }
  }

  private showMessage(message: string): void {
    this.snackbar.open(message, 'Close', { duration: 5000 });
  }
}
