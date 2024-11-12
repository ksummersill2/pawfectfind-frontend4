export interface Bundle {
  id: string;
  name: string;
  breed: string;
  user_id: string;
  items: BundleItem[];
  total_price: number;
  discount_percentage: number;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface BundleItem {
  id: string;
  product_id: string;
  bundle_id: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBundleInput {
  name: string;
  breed: string;
  items: {
    id: string;
    price: number;
  }[];
}