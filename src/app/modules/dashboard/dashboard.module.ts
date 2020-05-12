import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './components/weather/weather.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';



@NgModule({
  declarations: [WeatherComponent, StocksComponent, ExchangeRatesComponent],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
