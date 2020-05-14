import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { StocksDataSource } from './stocks.datasource';
import { StockItem } from '../../models/stock-item';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
})
export class StocksComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StockItem>;
  dataSource: StocksDataSource;

  displayedColumns = [
    'symbol',
    'open',
    'close',
    'low',
    'high',
    'previousClose',
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dataSource = new StocksDataSource(this.dashboardService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
