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
  // Set la largeur et hauteur par défaut du chart en fonction de la fenêtre du navigateur
  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (innerWidth > 300 && innerWidth < 700) {
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

  /*
   * Récupération des données via le service, on gère la souscription via l'opérateur takeUntil
   * Récupération du pays via ActivatedRoute
   * On renseigne les propriétés du composant (data, olympic, numberOfEntries, total) en itérent sur réponse du service
   * Si aucun pays trouvé, on redirige sur la route wildcard (404)
   */
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
  // Méthode qui permet de resize le chart dans le cas ou la fenêtre du navigateur se rétrécit
  onResize(event: UIEvent): void {
    const target = event?.target as Window;
    if (innerWidth > 300 && innerWidth < 700) {
      this.view = [target.innerWidth, 300];
    } else if (innerWidth > 700) {
      this.view = [700, 300];
    } else if (innerWidth < 300) {
      this.view = [300, 300];
    }
  }

  // Empêche le formattage des valeurs de x et y avec des virgules ou points
  axisFormat(val: any) {
    return val;
  }

  // OnDestroy => On émet true à l'observable destroy$ et on le complete, ce qui va permettre d'unsubscibe
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
