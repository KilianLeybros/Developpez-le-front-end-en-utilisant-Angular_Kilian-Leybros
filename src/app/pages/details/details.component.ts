import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  constructor() {}

  public loading: boolean = false;
  public olympic: Olympic | null = null;
  public numberOfEntries: number = 0;
  public total: { numberOfMedals: number; numberOfAthletes: number } = {
    numberOfMedals: 0,
    numberOfAthletes: 0,
  };

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

  ngOnInit(): void {}
}
