import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, map, retry, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { SpecificError } from '../models/SpecificError';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$: BehaviorSubject<Olympic[] | null> = new BehaviorSubject<
    Olympic[] | null
  >(null);

  constructor(private http: HttpClient) {}

  // Récupération des données via un call http dabs le fichier json et alimentation de l'observable "olympics$"
  // En cas d'erreur, retourne une erreur 500
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError(() => {
        throw new SpecificError(
          500,
          'Internal Server Error',
          'An internal server error has occured'
        );
      }),
      retry(2)
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  // Récupération des données d'un pays en particulier
  getOlympicsByCountryName(
    selectedCountry: string
  ): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      filter((olympics): olympics is Olympic[] => !!olympics),
      map((olympics: Olympic[]) => {
        return olympics.find((o) => o.country === selectedCountry);
      })
    );
  }
}
