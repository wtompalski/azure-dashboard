import { StockItem } from './stock-item';

export interface StockItemDelta extends StockItem {
  d: number;
}
