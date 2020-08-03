import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthenticationData } from './authentication-data';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const USERS_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token = ''; // current jwt
  private tokenExpiryTimer: ReturnType<typeof setTimeout> = setTimeout(
    () => '',
    0
  );
  private status = false; // auth status
  private statusObserver = new Subject<boolean>();
  private userId = ''; // current user id
  private displayName = ''; // current user name

  constructor(private http: HttpClient, private router: Router) {}

  public register(email: string, password: string, displayName: string): void {
    const authenticationData: AuthenticationData = {
      email,
      password,
      displayName,
    };
    this.http
      .post<{ success: boolean }>(`${USERS_URL}/register`, authenticationData)
      .subscribe(
        response => {
          this.router.navigateByUrl('/login');
        },
        err => {
          this.statusObserver.next(false);
        }
      );
  }

  public login(email: string, password: string): void {
    const authenticationData: AuthenticationData = { email, password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        displayName: string;
      }>(`${USERS_URL}/login`, authenticationData)
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            this.setTimer(response.expiresIn);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + response.expiresIn * 1000
            );
            this.userId = response.userId;
            this.displayName = response.displayName;
            this.storeToken(
              this.token,
              expirationDate,
              this.userId,
              this.displayName
            );
            this.status = true;
            this.statusObserver.next(true);
            this.router.navigateByUrl('/');
          }
        },
        err => {
          this.statusObserver.next(false);
        }
      );
  }

  public logout(): void {
    this.token = '';
    clearTimeout(this.tokenExpiryTimer);
    this.clearToken();
    this.userId = '';
    this.displayName = '';
    this.status = false;
    this.statusObserver.next(false);
    this.router.navigateByUrl('/');
  }

  public getToken(): string {
    return this.token;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public getStatus(): boolean {
    return this.status;
  }

  public getStatusListener(): Observable<boolean> {
    return this.statusObserver.asObservable();
  }

  private storeToken(
    token: string,
    expirationDate: Date,
    userId: string,
    displayName: string
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('exp', expirationDate.toISOString());
    localStorage.setItem('id', userId);
    localStorage.setItem('name', displayName);
  }

  private clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
  }

  private fetchTokenFromStorage(): null | {
    token: string;
    expirationDate: Date;
    userId: string;
    displayName: string;
  } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('exp');
    const userId = localStorage.getItem('id');
    const displayName = localStorage.getItem('name');
    if (!token || !expirationDate || !userId || !displayName) {
      return null;
    }
    return {
      token: token as string,
      expirationDate: new Date(expirationDate as string),
      userId: userId as string,
      displayName: displayName as string,
    };
  }

  public authenticateViaStorage(): void {
    const userData = this.fetchTokenFromStorage();
    if (!userData) {
      return;
    }
    const now = new Date();
    const expiresIn = userData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = userData.token;
      this.userId = userData.userId;
      this.displayName = userData.displayName;
      this.setTimer(expiresIn / 1000);
      this.status = true;
      this.statusObserver.next(true);
    }
  }

  private setTimer(expiresIn: number): void {
    this.tokenExpiryTimer = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000);
  }
}
