export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockQuantity: number;
  category: string;
  description: string;
  specifications: { [key: string]: string };
  images: string[];
  reviews: Review[];
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  savedForLater?: boolean;
}

export interface BillingInfo {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  billingInfo: BillingInfo;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  createdAt: string;
  trackingNumber?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  isAdmin?: boolean;
}
