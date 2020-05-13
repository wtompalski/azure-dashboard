import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, merge, Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

export interface StockItem {
  quoteType: string;
  quoteSourceName: string;
  currency: string;
  shortName: string;
  exchangeTimezoneName: string;
  symbol: string;
}

const EXAMPLE_DATA: StockItem[] = [
  {
    quoteType: 'EQUITY',
    quoteSourceName: 'Nasdaq Real Time Price',
    currency: 'USD',
    shortName: 'Microsoft Corporation',
    exchangeTimezoneName: 'America/New_York',
    symbol: 'MSFT',
  },
  {
    quoteType: 'EQUITY',
    quoteSourceName: 'Nasdaq Real Time Price',
    currency: 'USD',
    shortName: 'Microsoft Corporation',
    exchangeTimezoneName: 'America/New_York',
    symbol: 'MSFT',
  },
  {
    quoteType: 'EQUITY',
    quoteSourceName: 'Nasdaq Real Time Price',
    currency: 'USD',
    shortName: 'Microsoft Corporation',
    exchangeTimezoneName: 'America/New_York',
    symbol: 'MSFT',
  },
  {
    quoteType: 'EQUITY',
    quoteSourceName: 'Nasdaq Real Time Price',
    currency: 'USD',
    shortName: 'Microsoft Corporation',
    exchangeTimezoneName: 'America/New_York',
    symbol: 'MSFT',
  },
];

export class StocksDataSource extends DataSource<StockItem>
  implements OnDestroy {
  data: StockItem[] = EXAMPLE_DATA;
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
  connect(): Observable<StockItem[]> {
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
        case 'quoteType':
          return this.compare(a.quoteType, b.quoteType, isAsc);
        case 'quoteSourceName':
          return this.compare(a.quoteSourceName, b.quoteSourceName, isAsc);
        case 'currency':
          return this.compare(a.currency, b.currency, isAsc);
        case 'shortName':
          return this.compare(a.shortName, b.shortName, isAsc);
        case 'exchangeTimezoneName':
          return this.compare(
            a.exchangeTimezoneName,
            b.exchangeTimezoneName,
            isAsc
          );
        case 'symbol':
          return this.compare(a.symbol, b.symbol, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
