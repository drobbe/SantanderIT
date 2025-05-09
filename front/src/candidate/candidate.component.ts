import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CandidateService } from '../service/candidate.service';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],

  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
})
export class CandidateComponent {
  candidateForm;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private candidateService: CandidateService
  ) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.candidateForm.patchValue({ file });
    }
  }

  submit() {
    if (this.candidateForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.candidateForm.value.name!);
    formData.append('surname', this.candidateForm.value.surname!);
    formData.append('file', this.candidateForm.value.file!);

    this.candidateService.uploadCandidate(formData).subscribe({
      next: (res) => {
        console.log('Response from backend:', res);
        alert('Candidate uploaded successfully');
      },
      error: (err) => console.error('Upload error:', err),
    });
  }
}
