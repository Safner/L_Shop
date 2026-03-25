export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface UserCart {
  userId: string;
  items: CartItem[];
}
