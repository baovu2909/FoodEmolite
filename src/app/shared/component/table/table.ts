import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  TableColumn,
  TableCellValue,
  TableRow
} from '../../../common/models/front-end/table/table-column.model';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './table.html'
})
export class AppTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() rows: TableRow[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() loading = false;
  @Input() sortBy = '';
  @Input() asc = false;
  @Input() emptyText = 'Không có dữ liệu';

  @Output() sortChange = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<TableRow>();
  @Output() pageChange = new EventEmitter<number>();

  trackByColumn(_: number, item: TableColumn): string {
    return item.key;
  }

  getValue(row: TableRow, key: string): TableCellValue {
    return row[key];
  }

  getDateValue(row: TableRow, key: string): string | number | Date | null {
    const value = row[key];

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Date
    ) {
      return value;
    }

    return null;
  }

  onRowClick(row: TableRow): void {
    this.rowClick.emit(row);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) {
      return;
    }

    this.sortChange.emit(column.key);
  }
}