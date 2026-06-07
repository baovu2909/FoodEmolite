export interface BaseResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;
}

export interface BaseTableResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}