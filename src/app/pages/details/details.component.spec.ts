import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let olympicServiceSpy: any;

  beforeEach(async () => {
    olympicServiceSpy = jasmine.createSpyObj('OlympicService', [
      'getOlympicsByCountryName',
    ]);
    olympicServiceSpy.getOlympicsByCountryName.and.returnValue(
      of({
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
      })
    );

    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      providers: [
        { provide: OlympicService, useValue: olympicServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { country: 'Italy' } },
          },
        },
      ],
    }).compileComponents();
    TestBed.inject(ActivatedRoute);
    TestBed.inject(OlympicService);
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('olympic should be initialized', () => {
    expect(olympicServiceSpy.getOlympicsByCountryName).toHaveBeenCalled();
    expect(fixture.componentInstance.countryName).toEqual('Italy');
    expect(fixture.componentInstance.numberOfEntries).toEqual(3);
    expect(fixture.componentInstance.total.numberOfAthletes).toEqual(1128);
    expect(fixture.componentInstance.total.numberOfMedals).toEqual(96);
  });
});
