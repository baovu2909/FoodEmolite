import { Component, inject, signal } from '@angular/core';
import { AppTableComponent } from '../../../shared/component/table/table';
import { FilterComponent } from '../../../shared/component/filter/filter';
import { ToastService } from '../../../common/services/toast.service';
import { OrderService } from '../../../common/services/order.service';
import { ProfileService } from '../../../common/services/profile.service';
import { FilterField } from '../../../common/models/front-end/filter/filter-field.model';
import {
    TableColumn,
    TableRow
} from '../../../common/models/front-end/table/table-column.model';
import {
    OrderResponse,
    UpdateOrderStatusRequest
} from '../../../common/models/order.model';
import { PopUpAgentOrderDetailComponent } from './pop-up-agent-order-detail/pop-up-agent-order-detail';
interface OrderFilter {
    orderStatus: string;
    paymentStatus: string;
}

@Component({
    selector: 'app-page-agent-orders',
    imports: [
        AppTableComponent,
        FilterComponent,
        PopUpAgentOrderDetailComponent
    ],
    templateUrl: './agent-orders.html'
})
export class PageAgentOrdersComponent {
    private readonly orderService = inject(OrderService);
    private readonly profileService = inject(ProfileService);
    private readonly toastService = inject(ToastService);

    orders = signal<OrderResponse[]>([]);
    selectedOrder = signal<OrderResponse | null>(null);
    storeRefCode = signal<string | null>(null);

    page = signal(1);
    pageSize = signal(10);
    totalPages = signal(1);
    loading = signal(false);
    isSubmitting = signal(false);
    isDetailOpen = signal(false);
    isDetailRendered = signal(false);

    sortBy = signal('');
    asc = signal(false);

    filter = signal<OrderFilter>({
        orderStatus: '',
        paymentStatus: ''
    });

    columns: TableColumn[] = [
        {
            key: 'index',
            label: 'STT',
            width: '80px',
            align: 'center'
        },
        {
            key: 'id',
            label: 'Mã đơn',
            width: '100px',
            align: 'center',
            sortable: true
        },
        {
            key: 'totalAmount',
            label: 'Tổng tiền',
            width: '140px',
            align: 'right',
            sortable: true
        },
        {
            key: 'orderStatusText',
            label: 'Trạng thái đơn',
            width: '160px',
            align: 'center'
        },
        {
            key: 'paymentStatusText',
            label: 'Thanh toán',
            width: '140px',
            align: 'center'
        },
        {
            key: 'note',
            label: 'Ghi chú',
            width: '220px'
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            width: '180px',
            sortable: true
        }
    ];

    filterFields: FilterField[] = [
        {
            key: 'orderStatus',
            label: 'Trạng thái đơn',
            type: 'select',
            placeholder: 'Tất cả trạng thái',
            options: [
                {
                    label: 'Chờ xác nhận',
                    value: 'PENDING'
                },
                {
                    label: 'Đã xác nhận',
                    value: 'CONFIRMED'
                },
                {
                    label: 'Đang chuẩn bị',
                    value: 'PROCESSING'
                },
                {
                    label: 'Hoàn thành',
                    value: 'COMPLETED'
                },
                {
                    label: 'Đã hủy',
                    value: 'CANCELLED'
                }
            ]
        },
        {
            key: 'paymentStatus',
            label: 'Thanh toán',
            type: 'select',
            placeholder: 'Tất cả thanh toán',
            options: [
                {
                    label: 'Chưa thanh toán',
                    value: 'UNPAID'
                },
                {
                    label: 'Đã thanh toán',
                    value: 'PAID'
                }
            ]
        }
    ];

    constructor() {
        this.loadMyStore();
    }

    rows(): TableRow[] {
        const filter = this.filter();

        let data = this.orders().filter(order => {
            const matchOrderStatus =
                !filter.orderStatus ||
                order.orderStatus === filter.orderStatus;

            const matchPaymentStatus =
                !filter.paymentStatus ||
                order.paymentStatus === filter.paymentStatus;

            return matchOrderStatus && matchPaymentStatus;
        });

        if (this.sortBy()) {
            data = [...data].sort((a, b) => {
                let aValue: string | number = '';
                let bValue: string | number = '';

                if (this.sortBy() === 'id') {
                    aValue = a.id;
                    bValue = b.id;
                }

                if (this.sortBy() === 'totalAmount') {
                    aValue = a.totalAmount;
                    bValue = b.totalAmount;
                }

                if (this.sortBy() === 'createdAt') {
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
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

        return data.map((order, index) => ({
            index: (this.page() - 1) * this.pageSize() + index + 1,
            id: order.id,
            refCode: order.refCode,
            storeRefCode: order.storeRefCode,
            totalAmount: this.formatCurrency(order.totalAmount),
            orderStatus: order.orderStatus,
            orderStatusText: this.getOrderStatusText(order.orderStatus),
            paymentStatus: order.paymentStatus,
            paymentStatusText: this.getPaymentStatusText(order.paymentStatus),
            note: order.note ?? '',
            createdAt: this.formatDate(order.createdAt)
        }));
    }

    loadMyStore(): void {
        this.loading.set(true);

        this.profileService.getMyProfile().subscribe({
            next: response => {
                if (!response.isSuccess || !response.data?.store?.refCode) {
                    this.loading.set(false);
                    this.toastService.error('Không tìm thấy cửa hàng của đại lý');
                    return;
                }

                this.storeRefCode.set(response.data.store.refCode);
                this.loadOrders();
            },
            error: () => {
                this.loading.set(false);
                this.toastService.error('Không tải được thông tin đại lý');
            }
        });
    }

    loadOrders(): void {
        const refCode = this.storeRefCode();

        if (!refCode) {
            this.loading.set(false);
            return;
        }

        this.loading.set(true);

        this.orderService.getByStoreRefCode(
            refCode,
            this.page(),
            this.pageSize()
        ).subscribe({
            next: response => {
                this.orders.set(response.items);
                this.totalPages.set(response.totalPages);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.toastService.error('Không tải được danh sách đơn hàng');
            }
        });
    }

    openDetail(row: TableRow): void {
        const id = Number(row['id']);
        const order = this.orders().find(x => x.id === id);

        if (!order) {
            return;
        }

        this.selectedOrder.set(order);
        this.isDetailRendered.set(true);
        this.isDetailOpen.set(true);
    }

    closeDetail(): void {
        this.isDetailOpen.set(false);

        setTimeout(() => {
            this.isDetailRendered.set(false);
            this.selectedOrder.set(null);
        }, 200);
    }

    updateStatus(request: UpdateOrderStatusRequest): void {
        const order = this.selectedOrder();

        if (!order) return;

        this.isSubmitting.set(true);

        this.orderService.updateStatus(order.id, request).subscribe({
            next: response => {
                this.isSubmitting.set(false);

                if (!response.isSuccess) {
                    this.toastService.error(response.message);
                    return;
                }

                this.toastService.success(response.message);
                this.closeDetail();
                this.loadOrders();
            },
            error: () => {
                this.isSubmitting.set(false);
                this.toastService.error('Cập nhật trạng thái đơn thất bại');
            }
        });
    }

    onPageChange(page: number): void {
        this.page.set(page);
        this.loadOrders();
    }

    onFilterChange(value: OrderFilter): void {
        this.filter.set(value);
    }

    onSortChange(key: string): void {
        if (this.sortBy() === key) {
            this.asc.set(!this.asc());
            return;
        }

        this.sortBy.set(key);
        this.asc.set(true);
    }

    getOrderStatusText(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'PROCESSING':
                return 'Đang chuẩn bị';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    }

    getPaymentStatusText(status: string): string {
        switch (status) {
            case 'UNPAID':
                return 'Chưa thanh toán';
            case 'PAID':
                return 'Đã thanh toán';
            default:
                return status;
        }
    }

    private formatCurrency(value: number): string {
        return `${value.toLocaleString('vi-VN')}đ`;
    }

    private formatDate(value: string): string {
        return new Date(value).toLocaleString('vi-VN');
    }
}