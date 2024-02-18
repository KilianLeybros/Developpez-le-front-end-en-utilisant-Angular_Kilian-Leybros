import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Subject, takeUntil } from 'rxjs';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (innerWidth > 400 && innerWidth < 700) {
      this.view = [innerWidth, 300];
    }
  }

  public loading: boolean = true;
  public olympic: Olympic | null = null;
  public numberOfEntries: number = 0;
  public total: { numberOfMedals: number; numberOfAthletes: number } = {
    numberOfMedals: 0,
    numberOfAthletes: 0,
  };
  private destroy$ = new Subject();

  //Chart options
  data: LineChartData[] | null = null;
  view: [number, number] = [700, 300];
  colorScheme: Color = {
    name: 'color',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#04838f'],
  };
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals';
  //

  ngOnInit(): void {
    this.olympicService
      .getOlympicsByCountryName(this.activatedRoute.snapshot.params['country'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (olympic) => {
          if (olympic) {
            this.data = [
              {
                name: olympic.country,
                series: olympic.participations.map((x) => ({
                  name: x.year.toString(),
                  value: x.medalsCount,
                })),
              },
            ];
            this.olympic = olympic;
            this.numberOfEntries = olympic.participations.length;
            this.total = olympic.participations
              .map(
                ({ medalsCount: medalsCount, athleteCount: athleteCount }) => ({
                  medalsCount,
                  athleteCount,
                })
              )
              .reduce<{
                numberOfMedals: number;
                numberOfAthletes: number;
              }>((acc, val) => {
                return {
                  numberOfMedals: (acc.numberOfMedals += val.medalsCount),
                  numberOfAthletes: (acc.numberOfAthletes += val.athleteCount),
                };
              }, this.total);
            this.loading = false;
          } else {
            this.router.navigateByUrl('**', {
              skipLocationChange: true,
            });
          }
        },
      });
  }

  onResize(event: UIEvent): void {
    const target = event?.target as Window;
    if (innerWidth > 400 && innerWidth < 700) {
      this.view = [target.innerWidth, 300];
    } else if (innerWidth > 700) {
      this.view = [700, 300];
    } else if (innerWidth < 400) {
      this.view = [400, 300];
    }
  }

  axisFormat(val: any) {
    return val;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
