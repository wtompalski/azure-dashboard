import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WeatherConditions } from './models/weather-conditions';
import { ExchangeRate } from './models/exchange-rate';
import { parseString } from 'xml2js';
import { StockItem } from './models/stock-item';
import { environment } from 'src/environments/environment';
import { StockItemDelta } from './models/stock-item-delta';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getWeatherConditions(city: string): Observable<WeatherConditions> {
    const params = new HttpParams()
      .set('key', 'e5bde0bca9784e54a0755717201305')
      .set('q', city);

    return this.http.get<WeatherConditions>(environment.weatherUrl, {
      params: params,
    });
  }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http
      .get(environment.currencyExchangeUrl, { responseType: 'text' })
      .pipe(map((response) => this.extractExchangeRates(response)));
  }

  getStockItem(symbol: string): Observable<StockItemDelta> {
    const params = new HttpParams()
      .set('token', 'bqudtkfrh5rc9givu6vg')
      .set('symbol', symbol);

    return this.http
      .get<StockItem>(environment.stockUrl, { params: params })
      .pipe(
        map((response) => ({
          ...response,
          s: symbol,
          d: response.c - response.pc,
        }))
      );
  }

  private extractExchangeRates(content: string): ExchangeRate[] {
    var exchangeRates: ExchangeRate[] = [];
    parseString(content, function (err, result) {
      var cubes = result['gesmes:Envelope'].Cube[0].Cube[0].Cube;
      for (var cube of cubes) {
        exchangeRates.push({
          currency: cube.$.currency,
          rate: cube.$.rate,
        });
      }
    });

    return exchangeRates;
  }
}
