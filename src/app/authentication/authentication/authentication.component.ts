import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
    public authenticationService: AuthenticationService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.state = url.toString();
    });
    this.authenticationListener = this.authenticationService
      .getStatusListener()
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.isLoading = false;
        }
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
      this.authenticationService.register(
        form.value.email,
        form.value.password,
        form.value.displayName
      );
    }
  }
}
