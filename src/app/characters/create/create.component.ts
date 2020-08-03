import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Character } from '../character';
import { CharactersService } from '../characters.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { mimeTypeValidator } from './mime-type.validator';
import { MatStepper } from '@angular/material/stepper';

interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private state: 'create' | 'edit' = 'create';
  public isLoading = false;

  private charId = '';
  public character = {} as Character;
  public imagePreview = '';

  private authenticationListener = new Subscription();

  firstStep = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(64)]],
    description: ['', [Validators.required, Validators.maxLength(8192)]],
    image: ['', { asyncValidators: mimeTypeValidator }],
    isPrivate: false,
  });
  secondStep = this.fb.group({
    gender: '',
    race: '',
    class: '',
  });
  thirdStep = this.fb.group({
    alignment: '',
    background: '',
    faith: ['', Validators.maxLength(64)],
  });

  genders: Select[] = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' },
    { value: 'nonbinary', viewValue: 'Nonbinary' },
  ];

  races: Select[] = [
    { value: 'human', viewValue: 'Human' },
    { value: 'elf', viewValue: 'Elf' },
    { value: 'dwarf', viewValue: 'Dwarf' },
    { value: 'halfling', viewValue: 'Halfling' },
  ];

  classes: Select[] = [
    { value: 'barbarian', viewValue: 'Barbarian' },
    { value: 'bard', viewValue: 'Bard' },
    { value: 'cleric', viewValue: 'Cleric' },
    { value: 'druid', viewValue: 'Druid' },
    { value: 'fighter', viewValue: 'Fighter' },
    { value: 'monk', viewValue: 'Monk' },
    { value: 'paladin', viewValue: 'Paladin' },
    { value: 'ranger', viewValue: 'Ranger' },
    { value: 'rogue', viewValue: 'Rogue' },
    { value: 'sorcerer', viewValue: 'Sorcerer' },
    { value: 'warlock', viewValue: 'Warlock' },
    { value: 'wizard', viewValue: 'Wizard' },
  ];

  alignments: Select[] = [
    { value: 'lawful-good', viewValue: 'Lawful Good' },
    { value: 'lawful-neutral', viewValue: 'Lawful Neutral' },
    { value: 'lawful-evil', viewValue: 'Lawful Evil' },
    { value: 'neutral-good', viewValue: 'Neutral Good' },
    { value: 'neutral', viewValue: 'Neutral' },
    { value: 'neutral-evil', viewValue: 'Neutral Evil' },
    { value: 'chaotic-good', viewValue: 'Chaotic Good' },
    { value: 'chaotic-neutral', viewValue: 'Chaotic Neutral' },
    { value: 'chaotic-evil', viewValue: 'Chaotic Evil' },
  ];

  backgrounds: Select[] = [
    { value: 'acolyte', viewValue: 'Acolyte' },
    { value: 'criminal-spy', viewValue: 'Criminal / Spy' },
    { value: 'folk-hero', viewValue: 'Folk Hero' },
    { value: 'noble', viewValue: 'Noble' },
    { value: 'sage', viewValue: 'Sage' },
    { value: 'soldier', viewValue: 'Soldier' },
  ];

  constructor(
    private charactersService: CharactersService,
    public route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authenticationListener = this.authenticationService
      .getStatusListener()
      .subscribe(isAuthenticated => (this.isLoading = false));
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('charId')) {
        this.state = 'edit';
        this.charId = paramMap.get('charId') as string;
        this.isLoading = true;
        this.charactersService
          .getCharacter(this.charId)
          .subscribe(character => {
            this.isLoading = false;
            this.character = character;
            this.firstStep.setValue({
              name: this.character.name,
              description: this.character.description,
              image: this.character.imageUrl,
              isPrivate: this.character.isPrivate,
            });
            this.secondStep.setValue({
              gender: this.character.gender,
              race: this.character.race,
              class: this.character.class,
            });
            this.thirdStep.setValue({
              alignment: this.character.alignment,
              background: this.character.background,
              faith: this.character.faith,
            });
          });
      } else {
        this.state = 'create';
        this.charId = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.authenticationListener.unsubscribe();
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.firstStep.patchValue({ image: file });
    this.firstStep.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);
  }

  clearForms(): void {
    this.firstStep.reset();
    this.firstStep.markAsPristine();
    this.secondStep.reset();
    this.secondStep.markAsPristine();
    this.thirdStep.reset();
    this.thirdStep.markAsPristine();
  }

  onSave(): void {
    if (
      this.firstStep.invalid ||
      this.secondStep.invalid ||
      this.thirdStep.invalid
    ) {
      return;
    }

    this.isLoading = true;

    if (this.state === 'create') {
      this.charactersService.createCharacter(
        this.firstStep.value.name,
        this.firstStep.value.description,
        this.firstStep.value.image,
        this.firstStep.value.isPrivate,
        this.secondStep.value.gender,
        this.secondStep.value.race,
        this.secondStep.value.class,
        this.thirdStep.value.alignment,
        this.thirdStep.value.background,
        this.thirdStep.value.faith
      );
    } else {
      this.charactersService.updateCharacter(
        this.character._id,
        this.firstStep.value.name,
        this.firstStep.value.description,
        this.firstStep.value.image,
        this.firstStep.value.isPrivate,
        this.secondStep.value.gender,
        this.secondStep.value.race,
        this.secondStep.value.class,
        this.thirdStep.value.alignment,
        this.thirdStep.value.background,
        this.thirdStep.value.faith
      );
    }

    this.firstStep.reset();
    this.secondStep.reset();
    this.thirdStep.reset();
  }
}
