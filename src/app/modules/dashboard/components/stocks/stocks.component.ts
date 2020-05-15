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
import { StockItem } from '../../models/stock-item';
import { DashboardService } from '../../dashboard.service';
import { Subject, forkJoin } from 'rxjs';
import { tap, finalize, takeUntil } from 'rxjs/operators';
import { StockItemDelta } from '../../models/stock-item-delta';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
})
export class StocksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StockItem>;
  dataSource: MatTableDataSource<StockItem>;
  loading = false;
  displayedColumns = ['t', 'd', 's', 'o', 'c', 'l', 'h', 'pc'];
  private symbols: string[] = ['AAPL', 'BA', 'DIS', 'GE', 'NKE', 'SBUX'];
  private unsubscribe$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<StockItemDelta>();

    this.loading = true;

    return forkJoin(
      this.symbols.map((symbol) => this.dashboardService.getStockItem(symbol))
    )
      .pipe(
        tap((result) => (this.dataSource.data = result)),
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  isRaising(stock: StockItemDelta): boolean {
    return stock.c > stock.pc;
  }

  isDropping(stock: StockItemDelta): boolean {
    return stock.c < stock.pc;
  }
}
