import { Component, inject, signal } from '@angular/core';
import { AppTableComponent } from '../../../shared/component/table/table';
import { FilterComponent } from '../../../shared/component/filter/filter';
import { ToastService } from '../../../common/services/toast.service';
import { StoreFoodService } from '../../../common/services/store-food.service';
import { FilterField } from '../../../common/models/front-end/filter/filter-field.model';
import {
  TableColumn,
  TableRow
} from '../../../common/models/front-end/table/table-column.model';
import { StoreFoodResponse } from '../../../common/models/store-food.model';

interface StoreFoodFilter {
  foodName: string;
  isAvailable: boolean | '';
}

@Component({
  selector: 'app-page-admin-foods',
  imports: [
    AppTableComponent,
    FilterComponent
  ],
  templateUrl: './foods.html'
})
export class PageAdminStoreFoodsComponent {
  private readonly storeFoodService = inject(StoreFoodService);
  private readonly toastService = inject(ToastService);

  storeFoods = signal<StoreFoodResponse[]>([]);

  page = signal(1);
  pageSize = signal(10);
  totalPages = signal(1);
  loading = signal(false);

  sortBy = signal('');
  asc = signal(false);

  filter = signal<StoreFoodFilter>({
    foodName: '',
    isAvailable: ''
  });

  columns: TableColumn[] = [
    {
      key: 'index',
      label: 'STT',
      width: '80px',
      align: 'center'
    },
    {
      key: 'thumbnailUrl',
      label: 'Ảnh',
      width: '90px',
      type: 'image'
    },
    {
      key: 'foodName',
      label: 'Tên món',
      width: '180px',
      sortable: true
    },
    {
      key: 'price',
      label: 'Giá',
      width: '130px',
      align: 'right',
      sortable: true
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      width: '120px',
      align: 'center',
      sortable: true
    },
    {
      key: 'description',
      label: 'Mô tả',
      width: '220px'
    },
    {
      key: 'storeName',
      label: 'Cửa hàng',
      width: '120px',
    },
    {
      key: 'isAvailable',
      label: 'Trạng thái',
      width: '150px',
      align: 'center',
      type: 'status'
    }
  ];

  filterFields: FilterField[] = [
    {
      key: 'foodName',
      label: 'Tên món',
      type: 'text',
      placeholder: 'Nhập tên món'
    },
    {
      key: 'isAvailable',
      label: 'Trạng thái',
      type: 'select',
      placeholder: 'Tất cả trạng thái',
      options: [
        {
          label: 'Đang bán',
          value: true
        },
        {
          label: 'Ngừng bán',
          value: false
        }
      ]
    }
  ];

  constructor() {
    this.loadStoreFoods();
  }

  rows(): TableRow[] {
    const filter = this.filter();

    let data = this.storeFoods()
      .filter(food => {
        const matchName =
          !filter.foodName ||
          food.foodName
            .toLowerCase()
            .includes(filter.foodName.toLowerCase());

        const matchStatus =
          filter.isAvailable === '' ||
          food.isAvailable === filter.isAvailable;

        return matchName && matchStatus;
      });

    if (this.sortBy()) {
      data = [...data].sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        if (this.sortBy() === 'foodName') {
          aValue = a.foodName.toLowerCase();
          bValue = b.foodName.toLowerCase();
        }

        if (this.sortBy() === 'price') {
          aValue = a.price;
          bValue = b.price;
        }

        if (this.sortBy() === 'quantity') {
          aValue = a.quantity;
          bValue = b.quantity;
        }

        if (aValue < bValue) {
          return this.asc() ? -1 : 1;
        }

        if (aValue > bValue) {
          return this.asc() ? 1 : -1;
        }

        return 0;
      });
    }

    return data.map((food, index) => ({
      index: (this.page() - 1) * this.pageSize() + index + 1,
      id: food.id,
      refCode: food.refCode,
      storeRefCode: food.storeRefCode,
      storeName: food.storeName,
      thumbnailUrl: food.thumbnailUrl,
      foodName: food.foodName,
      price: this.formatCurrency(food.price),
      quantity: food.quantity,
      description: food.description ?? '',
      isAvailable: food.isAvailable
    }));
  }

  onSortChange(key: string): void {
    if (this.sortBy() === key) {
      this.asc.set(!this.asc());
      return;
    }

    this.sortBy.set(key);
    this.asc.set(true);
  }

  loadStoreFoods(): void {
    this.loading.set(true);

    this.storeFoodService.getAll(
      this.page(),
      this.pageSize()
    ).subscribe({
      next: response => {
        this.storeFoods.set(response.items);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Không tải được danh sách món ăn');
      }
    });
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadStoreFoods();
  }

  onFilterChange(value: StoreFoodFilter): void {
    this.filter.set(value);
  }

  private formatCurrency(value: number): string {
    return `${value.toLocaleString('vi-VN')}đ`;
  }
}