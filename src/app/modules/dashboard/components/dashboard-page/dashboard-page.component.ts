import { Component, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Weather', cols: 1, rows: 1 },
          { title: 'Stocks', cols: 1, rows: 1 },
          { title: 'Exchange Rates', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Weather', cols: 2, rows: 1 },
        { title: 'Stocks', cols: 1, rows: 1 },
        { title: 'Exchange Rates', cols: 1, rows: 1 }
      ];
    }), takeUntil(this.unsubscribe$)
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
