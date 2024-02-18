import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { OlympicService } from './core/services/olympic.service';

describe('AppComponent', () => {
  let olympicServiceSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: OlympicService, useValue: olympicServiceSpy }],
    }).compileComponents();
    TestBed.inject(OlympicService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
