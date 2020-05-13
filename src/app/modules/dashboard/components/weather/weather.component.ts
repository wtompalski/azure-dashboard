import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { WeatherConditions } from '../../models/weather-conditions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  weatherConditions$: Observable<WeatherConditions>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.weatherConditions$ = this.dashboardService.getWeatherConditions();
  }
}
