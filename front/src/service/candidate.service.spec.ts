import { TestBed } from '@angular/core/testing';
import { CandidateService } from './candidate.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Candidate } from '../candidate/candidate';
import { provideHttpClient } from '@angular/common/http';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CandidateService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload candidate via POST', () => {
    const formData = new FormData();
    const mockResponse = { message: 'Uploaded' };

    service.uploadCandidate(formData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/candidates');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(formData);
    req.flush(mockResponse);
  });

  it('should fetch candidates via GET', () => {
    const mockCandidates: Candidate[] = [
      {
        name: 'Edgard',
        surname: 'Rojas',
        seniority: 'Mid',
        years: 3,
        availability: true,
      },
    ];

    service.getCandidate().subscribe((res) => {
      expect(res).toEqual(mockCandidates);
    });

    const req = httpMock.expectOne('http://localhost:3000/candidates');
    expect(req.request.method).toBe('GET');
    req.flush(mockCandidates);
  });
});
