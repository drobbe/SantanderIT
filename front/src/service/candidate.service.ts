import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candidate } from '../candidate/candidate';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private readonly baseUrl = 'http://localhost:3000/candidates';

  constructor(private http: HttpClient) {}

  uploadCandidate(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }

  getCandidate() {
    return this.http.get<Candidate[]>(this.baseUrl);
  }
}
