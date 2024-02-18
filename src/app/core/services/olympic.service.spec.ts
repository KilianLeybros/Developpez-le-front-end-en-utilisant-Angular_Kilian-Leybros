import { TestBed } from '@angular/core/testing';

import { OlympicService } from './olympic.service';
import { HttpClient } from '@angular/common/http';

describe('OlympicService', () => {
  let service: OlympicService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(OlympicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
