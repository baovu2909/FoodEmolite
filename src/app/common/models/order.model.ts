export interface CreateOrderRequest {
  storeRefCode: string;
  note?: string | null;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  storeFoodId: number;
  quantity: number;
}

export interface UpdateOrderStatusRequest {
  newStatus: string;
  changedNote?: string | null;
}

export interface OrderResponse {
  id: number;
  refCode: string;
  customerAccountId: number;
  storeRefCode: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  note?: string | null;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  foodName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}