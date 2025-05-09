import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private readonly baseUrl = 'localhost:3000/candidates';

  constructor(private http: HttpClient) {}

  uploadCandidate(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }
}
