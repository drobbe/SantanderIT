import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateComponent } from './candidate.component';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CandidateService } from '../service/candidate.service';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';

describe('CandidateComponent', () => {
  let component: CandidateComponent;
  let fixture: ComponentFixture<CandidateComponent>;
  let mockSnackBar: any;
  let mockDialog: any;
  let mockCandidateService: any;

  beforeEach(async () => {
    mockSnackBar = { open: jasmine.createSpy('open') };
    mockDialog = { open: jasmine.createSpy('open') };
    mockCandidateService = {
      uploadCandidate: jasmine.createSpy('uploadCandidate'),
      getCandidate: jasmine.createSpy('getCandidate'),
    };

    await TestBed.configureTestingModule({
      imports: [CandidateComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: CandidateService, useValue: mockCandidateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if form is invalid on submit', () => {
    component.candidateForm = component['fb'].group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      file: [null, Validators.required],
    });

    spyOn(component['snackBar'], 'open');

    component.submit();
    fixture.detectChanges();

    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Please complete the form correctly',
      'Close',
      { duration: 3000 }
    );
  });

  it('should submit form and open dialog on success', () => {
    const mockResponse = {
      name: 'Edgard',
      surname: 'Rojas',
      seniority: 'Mid',
      years: 3,
      availability: true,
    };

    component.candidateList = [];

    component.candidateForm.setValue({
      name: 'Jane',
      surname: 'Doe',
      file: new File([''], 'test.xlsx', { type: 'application/vnd.ms-excel' }),
    });

    mockCandidateService.uploadCandidate.and.returnValue(of(mockResponse));

    spyOn(component['snackBar'], 'open');
    spyOn(component['dialog'], 'open');

    component.submit();
    fixture.detectChanges();

    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Candidate uploaded successfully',
      'Close',
      { duration: 3000 }
    );

    expect(component['dialog'].open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: [mockResponse],
        height: '50%',
        minWidth: '700px',
      })
    );

    expect(component.selectedFileName).toBeNull();
  });

  it('should show error message from API on upload error', () => {
    const apiError = { error: { message: 'Archivo inválido' } };

    component.candidateForm.setValue({
      name: 'Edgar',
      surname: 'Rojas',
      file: new File([''], 'test.xlsx', {
        type: 'application/vnd.ms-excel',
      }),
    });

    spyOn(component['snackBar'], 'open');

    mockCandidateService.uploadCandidate.and.returnValue(
      throwError(() => apiError)
    );

    component.submit();

    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Archivo inválido',
      'Close',
      { duration: 3000 }
    );
  });

  it('should open dialog with candidates on showCandidates()', () => {
    const mockList = [
      {
        name: 'Test',
        surname: 'User',
        seniority: 'Senior',
        years: 5,
        availability: true,
      },
    ];

    mockCandidateService.getCandidate.and.returnValue(of(mockList));

    spyOn(component['dialog'], 'open');

    component.showCandidates();
    fixture.detectChanges();

    expect(component.candidateList).toEqual(mockList);
    expect(component['dialog'].open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: mockList,
        height: '50%',
        minWidth: '700px',
      })
    );
  });
});
