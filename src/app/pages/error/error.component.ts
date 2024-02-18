import { Component, Input, OnInit } from '@angular/core';
import { SpecificError } from 'src/app/core/models/SpecificError';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  @Input() public error!: SpecificError;

  constructor() {}

  ngOnInit(): void {}

  public reload() {
    window.location.reload();
  }
}
