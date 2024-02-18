import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { SpecificError } from './core/models/SpecificError';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private olympicService: OlympicService) {}

  public error: SpecificError | null = null;
  public loading: boolean = true;

  ngOnInit(): void {
    this.olympicService
      .loadInitialData()
      .pipe(take(1))
      .subscribe({
        error: (err) => {
          this.error = err;
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        },
      });
  }
}
