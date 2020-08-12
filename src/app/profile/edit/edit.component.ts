import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  isLoading = false;

  editForm = this.fb.group({
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit(): void {}
}
