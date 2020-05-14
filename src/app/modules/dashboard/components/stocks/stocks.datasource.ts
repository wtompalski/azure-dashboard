import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, takeUntil, tap, finalize } from 'rxjs/operators';
import { Observable, of, merge, Subject, concat, forkJoin } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { StockItem } from '../../models/stock-item';
import { DashboardService } from '../../dashboard.service';

export class StocksDataSource extends DataSource<StockItem>
  implements OnDestroy {
  symbols: string[] = ['AAPL', 'BA', 'DIS', 'GE', 'NKE', 'SBUX'];
  data: StockItem[] = [];
  paginator: MatPaginator;
  sort: MatSort;
  loading = true;

  private unsubscribe$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<StockItem[]> {
    this.loading = true;
    this.data = [];
    return forkJoin(
      this.symbols.map((symbol) =>
        this.dashboardService
          .getStockItem(symbol)
          .pipe(tap((result) => this.data.push(result)))
      )
    ).pipe(
      map((result) => this.getPagedData(this.getSortedData(result))),
      tap((result) => (this.data = result)),
      finalize(() => (this.loading = false)),
      takeUntil(this.unsubscribe$)
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: StockItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: StockItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'symbol':
          return this.compare(a.s, b.s, isAsc);
        case 'open':
          return this.compare(a.o, b.o, isAsc);
        case 'close':
          return this.compare(a.c, b.c, isAsc);
        case 'l':
          return this.compare(a.l, b.l, isAsc);
        case 'h':
          return this.compare(a.h, b.h, isAsc);
        case 'previousClose':
          return this.compare(a.pc, b.pc, isAsc);
        case 'tendency':
          return this.compare(a.pc - a.c, b.pc - b.c, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
