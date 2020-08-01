import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private authenticationService: AuthenticationService) {}

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
}
