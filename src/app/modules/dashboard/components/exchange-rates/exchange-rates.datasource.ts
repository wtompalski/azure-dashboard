import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, merge, Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ExchangeRate } from '../../models/exchange-rate';

const EXAMPLE_DATA: ExchangeRate[] = [
  { currency: 'USD', rate: 1.0858 },
  { currency: 'JPY', rate: 116.56 },
  { currency: 'BGN', rate: 1.9558 },
  { currency: 'CZK', rate: 27.423 },
  { currency: 'DKK', rate: 7.4577 },
  { currency: 'GBP', rate: 0.87773 },
  { currency: 'HUF', rate: 350.75 },
  { currency: 'PLN', rate: 4.5449 },
  { currency: 'RON', rate: 4.8301 },
  { currency: 'SEK', rate: 10.5968 },
  { currency: 'CHF', rate: 1.052 },
  { currency: 'ISK', rate: 158.7 },
  { currency: 'NOK', rate: 11.0518 },
  { currency: 'HRK', rate: 7.5653 },
  { currency: 'RUB', rate: 79.4157 },
  { currency: 'TRY', rate: 7.5979 },
  { currency: 'AUD', rate: 1.6625 },
  { currency: 'BRL', rate: 6.2708 },
  { currency: 'CAD', rate: 1.5178 },
  { currency: 'CNY', rate: 7.6933 },
  { currency: 'HKD', rate: 8.4154 },
  { currency: 'IDR', rate: 16073.64 },
  { currency: 'ILS', rate: 3.807 },
  { currency: 'INR', rate: 81.593 },
  { currency: 'KRW', rate: 1326.17 },
  { currency: 'MXN', rate: 25.8251 },
  { currency: 'MYR', rate: 4.6977 },
  { currency: 'NZD', rate: 1.7742 },
  { currency: 'PHP', rate: 54.388 },
  { currency: 'SGD', rate: 1.5357 },
  { currency: 'THB', rate: 34.854 },
  { currency: 'ZAR', rate: 19.7382 },
];

export class ExchangeRatesDataSource extends DataSource<ExchangeRate>
  implements OnDestroy {
  data: ExchangeRate[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  private unsubscribe$ = new Subject<void>();

  constructor() {
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
    const dataMutations = [
      of(this.data),
      this.paginator.page,
      this.sort.sortChange,
    ];

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      }),
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
