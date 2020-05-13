import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WeatherConditions } from './models/weather-conditions';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  weatherUrl = 'http://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient) {}

  getWeatherConditions(city: string): Observable<WeatherConditions> {
    const params = new HttpParams()
      .set('key', 'e5bde0bca9784e54a0755717201305')
      .set('q', city);

    return this.http.get<WeatherConditions>(this.weatherUrl, {
      params: params,
    });
  }
}
