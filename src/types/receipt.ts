export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SellerProfile {
  shopName: string;
  shopOwner: string;
  shopPhone: string;
  shopAddress: string;
  city: string; // e.g. "Cotonou", "Porto-Novo", "Abomey-Calavi", "Parakou"
  logoUrl: string | null;
  momoNumber: string; // MTN MoMo: 0157586308
  momoName: string;
  celtiisNumber: string; // Celtiis Cash: 0141159129
  celtiisName: string;
  ifuNumber?: string;
  rccmNumber?: string;
  defaultFooter: string;
}

export type ReceiptStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export type PaymentMethod = 'MTN_MOMO' | 'CELTIIS_CASH';

export interface Receipt {
  id: string;
  receiptNumber: string; // e.g. REC-2026-001
  createdAt: string; // ISO date
  updatedAt?: string;
  seller: SellerProfile;
  clientName: string;
  clientPhone: string; // Numéro WhatsApp (+229 ...)
  items: ReceiptItem[];
  totalAmount: number;
  advancePaid: number;
  balanceDue: number; // Reste à payer
  status: ReceiptStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  footerText: string;
}

export interface SubscriptionInfo {
  isSubscribed: boolean;
  freeReceiptsUsed: number;
  maxFreeReceipts: number; // 3
  subscriptionDate?: string;
  expiryDate?: string;
  plan: 'FREE_TRIAL' | 'PRO_MONTHLY';
  priceMonthly: number; // 1500 FCFA
}
