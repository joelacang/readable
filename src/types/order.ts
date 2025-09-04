import type { BookFormat, OrderStatus } from "@prisma/client";
import type { UserType } from "./users";

export type CustomerInfoType = {
  id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: AddressType | null;
};

export type AddressType = {
  line1: string;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode: string;
  country: string;
};

export type OrderItemType = {
  id: string;
  product: {
    id: string | null;
    name: string;
    format?: BookFormat | null;
    price: number;
    imageUrl?: string | null;
  };
  quantity: number;
  subTotal: number;
};

export type OrderPreviewType = {
  id: string;
  refCode: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  totalAmount: number;
  subTotal: number;
  shippingFee?: number | null;
  taxAmount?: number | null;
  discount?: number | null;
  status: OrderStatus;
  paymentStatus: string;
  dateCreated: Date;
  userInfo: UserType | null;
  shippingInfo: CustomerInfoType | null;
};

export type OrderDetailType = OrderPreviewType & {
  items: OrderItemType[];
  paymentInfo: {
    intentId?: string | null;
    method?: string | null;
    last4cc?: string | null;
    receiptUrl?: string | null;
    status: string;
  };
};
