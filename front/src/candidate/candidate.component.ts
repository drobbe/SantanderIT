import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CandidateService } from '../service/candidate.service';
import { TableCandidateComponent } from '../app/table-candidate/table-candidate.component';
import { Candidate } from './candidate';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    TableCandidateComponent,
  ],
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
})
export class CandidateComponent {
  candidateForm: FormGroup;
  selectedFileName: string | null = null;
  candidateList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private candidateService: CandidateService,
    private dialog: MatDialog
  ) {
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      surname: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)],
      ],
      file: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!validTypes.includes(file.type)) {
        this.snackBar.open('Only Excel files are allowed', 'Close', {
          duration: 3000,
        });
        return;
      }
      this.selectedFileName = file.name;
      this.candidateForm.patchValue({ file });
    }
  }

  submit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      this.snackBar.open('Please complete the form correctly', 'Close', {
        duration: 3000,
      });
      return;
    }

    const { name, surname, file } = this.candidateForm.value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('file', file);

    this.candidateService.uploadCandidate(formData).subscribe({
      next: (res) => {
        this.snackBar.open('Candidate uploaded successfully', 'Close', {
          duration: 3000,
        });
        this.candidateForm.reset();
        this.selectedFileName = null;

        this.candidateList.push(res);

        this.dialog.open(TableCandidateComponent, {
          data: this.candidateList,
          height: '50%',
          minWidth: '700px',
        });
      },
      error: (err) => {
        const apiMsg = err?.error?.message || 'Unexpected error';
        this.snackBar.open(apiMsg, 'Close', { duration: 3000 });
      },
    });
  }

  showCandidates(): void {
    this.candidateService.getCandidate().subscribe({
      next: (response: Candidate[]) => {
        this.candidateList = response;

        this.dialog.open(TableCandidateComponent, {
          data: this.candidateList,
          height: '50%',
          minWidth: '700px',
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to fetch candidates', 'Close', {
          duration: 3000,
        });
        console.error('Fetch error:', err);
      },
    });
  }
}
