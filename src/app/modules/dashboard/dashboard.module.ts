import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './components/weather/weather.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';



@NgModule({
  declarations: [WeatherComponent, StocksComponent, ExchangeRatesComponent, DashboardPageComponent],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
