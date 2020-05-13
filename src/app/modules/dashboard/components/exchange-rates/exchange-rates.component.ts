import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  ExchangeRatesDataSource,
  ExchangeRate,
} from './exchange-rates.datasource';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css']
})
export class ExchangeRatesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ExchangeRate>;
  dataSource: ExchangeRatesDataSource;

  displayedColumns = [
    'flag',
    'currency',
    'rate'
  ];

  ngOnInit() {
    this.dataSource = new ExchangeRatesDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
        
  getSymbol(exchangeRate: ExchangeRate):string {
    return 'https://www.x-rates.com/themes/x-rates/images/flags/' + exchangeRate.currency.toLowerCase() + '.png'
  }
}
