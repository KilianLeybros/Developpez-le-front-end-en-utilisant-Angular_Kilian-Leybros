import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let olympicServiceSpy: any;

  beforeEach(async () => {
    olympicServiceSpy = jasmine.createSpyObj('OlympicService', ['getOlympics']);
    olympicServiceSpy.getOlympics.and.returnValue(
      of([
        {
          id: 1,
          country: 'Italy',
          participations: [
            {
              id: 1,
              year: 2012,
              city: 'Londres',
              medalsCount: 28,
              athleteCount: 372,
            },
            {
              id: 2,
              year: 2016,
              city: 'Rio de Janeiro',
              medalsCount: 28,
              athleteCount: 375,
            },
            {
              id: 3,
              year: 2020,
              city: 'Tokyo',
              medalsCount: 40,
              athleteCount: 381,
            },
          ],
        },
        {
          id: 2,
          country: 'Spain',
          participations: [
            {
              id: 1,
              year: 2012,
              city: 'Londres',
              medalsCount: 20,
              athleteCount: 315,
            },
            {
              id: 2,
              year: 2016,
              city: 'Rio de Janeiro',
              medalsCount: 17,
              athleteCount: 312,
            },
            {
              id: 3,
              year: 2020,
              city: 'Tokyo',
              medalsCount: 17,
              athleteCount: 321,
            },
          ],
        },
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: OlympicService, useValue: olympicServiceSpy }],
    }).compileComponents();
    TestBed.inject(OlympicService);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('olympics should be initialized', () => {
    expect(olympicServiceSpy.getOlympics).toHaveBeenCalled();
    expect(fixture.componentInstance.josNumbers).toEqual(3);
    expect(fixture.componentInstance.countriesNumber).toEqual(2);
  });
});
