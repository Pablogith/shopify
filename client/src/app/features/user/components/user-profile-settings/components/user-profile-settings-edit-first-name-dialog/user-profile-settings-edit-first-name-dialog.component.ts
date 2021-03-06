import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'shopify-user-profile-settings-edit-first-name-dialog',
  templateUrl: './user-profile-settings-edit-first-name-dialog.component.html',
})
export class UserProfileSettingsEditFirstNameDialogComponent implements OnInit {
  public userInfoForm!: UntypedFormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserProfileSettingsEditFirstNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder
  ) {}

  public ngOnInit(): void {
    this.setUserInfoForm();
  }

  public close(): void {
    this.dialogRef.close();
  }

  public updateProfileData(): void {
    const updatedUserData = {
      firstName: this.userInfoForm.get('firstName')?.value,
      lastName: this.userInfoForm.get('lastName')?.value,
      email: this.userInfoForm.get('email')?.value,
    };
    this.dialogRef.close(updatedUserData);
  }

  private setUserInfoForm(): void {
    this.userInfoForm = this.fb.group({
      firstName: [
        this.data.firstName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      ],
      lastName: [
        this.data.lastName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      ],
      email: [this.data.email, [Validators.required, Validators.email]],
    });
  }
}
