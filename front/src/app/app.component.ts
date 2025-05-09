import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CandidateComponent } from '../candidate/candidate.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CandidateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
