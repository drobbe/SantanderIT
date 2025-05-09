import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-table-candidate',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './table-candidate.component.html',
  styleUrl: './table-candidate.component.css',
})
export class TableCandidateComponent {
  displayedColumns: string[] = [
    'name',
    'surname',
    'seniority',
    'years',
    'availability',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public candidateList: any[],
    public dialogRef: MatDialogRef<TableCandidateComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
