import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  public olympics: Olympic[] | null = null;
  public countriesNumber: number = 0;
  public josNumbers: number = 0;
  private destroy$: Subject<boolean> = new Subject();

  public data: PieChartData[] | null = null;
  public view: [number, number] = [700, 400];

  // Set la largeur et hauteur par défaut du chart en fonction de la fenêtre du navigateur
  constructor(private olympicService: OlympicService, private router: Router) {
    if (innerWidth > 300 && innerWidth < 700) {
      this.view = [innerWidth, 400];
    }
  }

  /*
   * Récupération des données via le service, on gère la souscription via l'opérateur takeUntil
   * On renseigne les propriétés du composant (countriesNumber, data, josNumber) en itérent sur réponse du service
   */
  ngOnInit(): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (olympics: Olympic[] | null) => {
          if (olympics !== null) {
            let totalParticipation: Participation[] = [];
            this.countriesNumber = olympics.length;
            this.data = olympics.map((o) => {
              let name: string = o.country;
              let value: number = 0;
              o.participations.map((p) => {
                totalParticipation.push(p);
                value += p.medalsCount;
              });
              return { name, value };
            });
            this.josNumbers = totalParticipation
              .map((x) => x.year)
              .filter(
                (value, index, array) => array.indexOf(value) === index
              ).length;
          }
          this.loading = false;
        },
      });
  }

  // Méthode qui est bind à l'event select du chart et qui permet de naviguer sur la page de détail
  onSelect(data: { name: string; value: number; label: string }): void {
    this.router.navigateByUrl(`/details/${data.name}`);
  }

  // Méthode qui permet de resize le chart dans le cas ou la fenêtre du navigateur se rétrécit
  onResize(event: UIEvent): void {
    const target = event?.target as Window;
    if (innerWidth > 300 && innerWidth < 700) {
      this.view = [target.innerWidth, 400];
    } else if (innerWidth > 700) {
      this.view = [700, 400];
    } else if (innerWidth < 300) {
      this.view = [300, 400];
    }
  }

  // OnDestroy => On émet true à l'observable destroy$ et on le complete, ce qui va permettre d'unsubscibe
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
