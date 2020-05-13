import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WeatherConditions } from './models/weather-conditions';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  weatherUrl = 'assets/mocks/weather-washington.json';

  constructor(private http: HttpClient) {}

  getWeatherConditions(): Observable<WeatherConditions> {
    return this.http.get<WeatherConditions>(this.weatherUrl);
  }
}
