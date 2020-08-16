import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  displayName = '';

  constructor(private authenticationService: AuthenticationService) {
    this.displayName = authenticationService.getDisplayName();
  }

  ngOnInit(): void {}
}
