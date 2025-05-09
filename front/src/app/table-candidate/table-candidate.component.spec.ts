import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCandidateComponent } from './table-candidate.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('TableCandidateComponent', () => {
  let component: TableCandidateComponent;
  let fixture: ComponentFixture<TableCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCandidateComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when closeDialog is called', () => {
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
