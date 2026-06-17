export interface UserDTO {
  id: string;
  emailId: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  token?: string;
}

export interface AuthenticatedUser {
  emailId: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN';
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  availableQuantity: number;
}

export interface CartProductResponse {
  items: CartItem[];
  subtotal: number;
  total: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  shippingAddress: string;
}

export interface PlaceOrderRequest {
  items: CartItem[];
  shippingAddress: string;
  paymentMethod: string;
  cardLastFour?: string;
}