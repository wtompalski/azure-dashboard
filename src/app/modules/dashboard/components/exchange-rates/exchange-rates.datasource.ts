import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, takeUntil, tap, finalize } from 'rxjs/operators';
import { Observable, of, merge, Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ExchangeRate } from '../../models/exchange-rate';
import { DashboardService } from '../../dashboard.service';

export class ExchangeRatesDataSource extends DataSource<ExchangeRate>
  implements OnDestroy {
  data: ExchangeRate[];
  paginator: MatPaginator;
  sort: MatSort;

  loading = true;

  private exchangeRates$: Observable<ExchangeRate[]>;

  private unsubscribe$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ExchangeRate[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    /*const dataMutations = [
      this.exchangeRates$,
      this.paginator.page,
      this.sort.sortChange,
    ];*/

    this.loading = true;

    return this.dashboardService.getExchangeRates().pipe(
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
  private getPagedData(data: ExchangeRate[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ExchangeRate[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'currency':
          return this.compare(a.currency, b.currency, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
