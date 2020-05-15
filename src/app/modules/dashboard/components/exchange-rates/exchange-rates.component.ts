import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExchangeRate } from '../../models/exchange-rate';
import { DashboardService } from '../../dashboard.service';
import { tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css'],
})
export class ExchangeRatesComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ExchangeRate>;
  dataSource: MatTableDataSource<ExchangeRate>;
  loading = false;
  displayedColumns = ['flag', 'currency', 'rate'];
  private unsubscribe$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ExchangeRate>();

    this.loading = true;

    this.dashboardService
      .getExchangeRates()
      .pipe(
        tap((result) => (this.dataSource.data = result)),
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSymbol(exchangeRate: ExchangeRate): string {
    return (
      'https://www.x-rates.com/themes/x-rates/images/flags/' +
      exchangeRate.currency.toLowerCase() +
      '.png'
    );
  }
}
