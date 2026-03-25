export interface DeliveryAddress {
  country: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
  postalCode?: string;
}

export interface DeliveryContact {
  name: string;
  phone: string;
  email: string;
}

export type PaymentMethod = "card" | "cash" | "online";

export interface DeliveryOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface DeliveryOrder {
  id: string;
  userId: string;
  createdAt: string;
  address: DeliveryAddress;
  contact: DeliveryContact;
  paymentMethod: PaymentMethod;
  items: DeliveryOrderItem[];
  totalPrice: number;
}
