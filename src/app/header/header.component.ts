import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private statusListener = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authenticationService.getStatus();
    this.statusListener = this.authenticationService
      .getStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.statusListener.unsubscribe();
  }

  onLogout(): void {
    this.authenticationService.logout();
  }

  onSearch(form: NgForm): void {
    this.router.navigateByUrl(`/characters?q=${form.value.search}`);
  }
}
