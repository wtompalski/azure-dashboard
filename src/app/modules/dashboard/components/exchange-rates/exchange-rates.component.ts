import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ExchangeRatesDataSource } from './exchange-rates.datasource';
import { ExchangeRate } from '../../models/exchange-rate';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css'],
})
export class ExchangeRatesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ExchangeRate>;
  dataSource: ExchangeRatesDataSource;

  constructor(private dashboardService: DashboardService) {}

  displayedColumns = ['flag', 'currency', 'rate'];

  ngOnInit() {
    this.dataSource = new ExchangeRatesDataSource(this.dashboardService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getSymbol(exchangeRate: ExchangeRate): string {
    return (
      'https://www.x-rates.com/themes/x-rates/images/flags/' +
      exchangeRate.currency.toLowerCase() +
      '.png'
    );
  }
}
