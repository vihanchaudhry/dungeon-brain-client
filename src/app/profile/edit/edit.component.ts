import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ValidationErrors,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.touched &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  isLoading = false;

  editForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: [''],
    },
    { validators: this.passwordValidator }
  );

  matcher = new PasswordErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
  }

  passwordValidator(group: FormGroup): ValidationErrors | null {
    const newPassword = group.controls.newPassword.value;
    const confirmNewPassword = group.controls.confirmNewPassword.value;

    return newPassword === confirmNewPassword ? null : { noMatch: true };
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authenticationService
      .changePassword(
        this.editForm.get('oldPassword')?.value,
        this.editForm.get('newPassword')?.value
      )
      .subscribe(
        response => {
          this.isLoading = false;
          this.showMessage(response.message);
          this.router.navigateByUrl('/profile');
        },
        err => {
          this.isLoading = false;
        }
      );
  }

  private showMessage(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
    });
  }
}
