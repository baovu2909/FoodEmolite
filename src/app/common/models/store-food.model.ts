export interface StoreFoodResponse {
  id: number;
  refCode: string;
  storeRefCode: string;
  foodName: string;
  thumbnailUrl: string | null;
  description: string | null;
  price: number;
  quantity: number;
  isAvailable: boolean;
}

export interface CreateStoreFoodRequest {
  storeRefCode: string;
  foodName: string;
  thumbnailFile?: File | null;
  description?: string | null;
  price: number;
  quantity: number;
}

export interface UpdateStoreFoodRequest {
  foodName: string;
  thumbnailFile?: File | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  price: number;
  quantity: number;
  isAvailable: boolean;
}