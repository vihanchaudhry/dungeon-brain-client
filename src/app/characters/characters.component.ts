import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Character } from './character';
import { CharactersService } from './characters.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent implements OnInit, OnDestroy {
  // Characters
  isLoading = false;
  characters: Character[] = [];
  private charactersListener = new Subscription();

  // Authentication
  isAuthenticated = false;
  userId = '';
  private authenticationListener = new Subscription();

  // Pagination
  count = 0; // total num of characters
  page = 1; // current page
  pageSize = 12; // size of each page
  pageSizeOptions = [6, 12, 24]; // different page size we can set

  constructor(
    private charactersService: CharactersService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.charactersService.getCharacters(1, this.pageSize);
    this.userId = this.authenticationService.getUserId();
    this.charactersListener = this.charactersService
      .getCharactersListener()
      .subscribe((response: { characters: Character[]; count: number }) => {
        this.isLoading = false;
        this.characters = response.characters;
        this.count = response.count;
      });
    this.isAuthenticated = this.authenticationService.getStatus();
    this.authenticationListener = this.authenticationService
      .getStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authenticationService.getUserId();
      });
  }

  ngOnDestroy(): void {
    this.charactersListener.unsubscribe();
    this.authenticationListener.unsubscribe();
  }

  onDelete(charId: string): void {
    this.isLoading = true;
    this.charactersService.deleteCharacter(charId).subscribe(
      () => {
        this.charactersService.getCharacters(this.page, this.pageSize);
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  onPageChange(pageEvent: PageEvent): void {
    this.isLoading = true;
    this.page = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
    this.charactersService.getCharacters(this.page, this.pageSize);
  }
}
