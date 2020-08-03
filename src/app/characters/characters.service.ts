import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Character } from './character';
import { environment } from '../../environments/environment';

const CHARACTERS_URL = `${environment.apiUrl}/characters`;

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private characters: Character[] = [];
  private count = 0; // total count of characters in the database
  private charactersObserver = new Subject<{
    characters: Character[];
    count: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  public getCharactersListener(): Observable<{
    characters: Character[];
    count: number;
  }> {
    return this.charactersObserver.asObservable();
  }

  public getCharacters(page?: number, pageSize?: number): void {
    this.http
      .get<{ characters: Character[]; count: number }>(
        `${CHARACTERS_URL}?page=${page}&pageSize=${pageSize}`
      )
      .subscribe(response => {
        this.characters = response.characters;
        this.count = response.count;
        this.charactersObserver.next({
          characters: [...this.characters],
          count: this.count,
        });
      });
  }

  public getCharacter(charId: string): Observable<Character> {
    return this.http.get<Character>(`${CHARACTERS_URL}/${charId}`);
  }

  public createCharacter(
    name: string,
    description: string,
    image: File,
    isPrivate: boolean,
    gender: string,
    race: string,
    // tslint:disable-next-line: variable-name
    _class: string,
    alignment: string,
    background: string,
    faith: string
  ): void {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image, name);
    }
    if (isPrivate) {
      formData.append('isPrivate', 'true');
    }
    formData.append('gender', gender);
    formData.append('race', race);
    formData.append('class', _class);
    formData.append('alignment', alignment);
    formData.append('background', background);
    formData.append('faith', faith);

    this.http.post<Character>(CHARACTERS_URL, formData).subscribe(response => {
      this.router.navigateByUrl('/characters');
    });
  }

  public updateCharacter(
    charId: string,
    name: string,
    description: string,
    image: File | string,
    isPrivate: boolean,
    gender: string,
    race: string,
    // tslint:disable-next-line: variable-name
    _class: string,
    alignment: string,
    background: string,
    faith: string
  ): void {
    let character: Character | FormData;
    if (typeof image === 'object') {
      character = new FormData();
      character.append('_id', charId);
      character.append('name', name);
      character.append('description', description);
      character.append('image', image, name);
      if (isPrivate) {
        character.append('isPrivate', 'true');
      }
      character.append('gender', gender);
      character.append('race', race);
      character.append('class', _class);
      character.append('alignment', alignment);
      character.append('background', background);
      character.append('faith', faith);
    } else {
      character = {
        _id: charId,
        name,
        description,
        imageUrl: image,
        isPrivate,
        gender,
        race,
        class: _class,
        alignment,
        background,
        faith,
      };
    }

    this.http
      .put<Character>(`${CHARACTERS_URL}/${charId}`, character)
      .subscribe(response => {
        this.router.navigateByUrl('/');
      });
  }

  public deleteCharacter(charId: string): Observable<Character> {
    return this.http.delete<Character>(`${CHARACTERS_URL}/${charId}`);
  }
}
