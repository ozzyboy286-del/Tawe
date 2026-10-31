import { Receipt, SellerProfile, SubscriptionInfo, PaymentMethod } from '../types/receipt';

const STORAGE_KEYS = {
  SELLER_PROFILE: 'recu_pro_seller_profile_v3',
  RECEIPTS: 'recu_pro_receipts_v3',
  SUBSCRIPTION: 'recu_pro_subscription_v3',
  COUNTER: 'recu_pro_counter_v3',
};

export const DEVELOPER_SUPPORT_PAYMENTS = {
  MTN_MOMO: {
    id: 'MTN_MOMO' as PaymentMethod,
    label: 'MTN Mobile Money',
    number: '0157586308',
    formatted: '01 57 58 63 08',
    name: 'jboy Ozzy (Clovis Arsène junior DOUBOGAN)',
    operator: 'MTN MoMo Bénin',
    ussdMenu: '*880#',
    ussdTransferPrefix: '*880*1*1*0157586308*',
    color: '#EAB308', // Yellow
    badgeBg: 'bg-amber-400 text-slate-950',
  },
  CELTIIS_CASH: {
    id: 'CELTIIS_CASH' as PaymentMethod,
    label: 'Celtiis Cash',
    number: '0141159129',
    formatted: '01 41 15 91 29',
    name: 'jboy Ozzy (Clovis Arsène junior DOUBOGAN)',
    operator: 'Celtiis Cash Bénin',
    ussdMenu: '*889#',
    ussdTransferPrefix: '*889*1*1*0141159129*',
    color: '#0284C7', // Sky Blue
    badgeBg: 'bg-sky-600 text-white',
  },
};

export const OFFICIAL_BENIN_PAYMENTS = DEVELOPER_SUPPORT_PAYMENTS;

export const DEFAULT_SELLER_PROFILE: SellerProfile = {
  shopName: 'Boutique Divine Cotonou',
  shopOwner: 'Mme Ahouéfa Mensah',
  shopPhone: '+229 97 25 40 18',
  shopAddress: 'Marché Dantokpa, Allée des Tissus, Cotonou',
  city: 'Cotonou',
  logoUrl: null,
  momoNumber: '97254018',
  momoName: 'Ahouéfa Mensah',
  celtiisNumber: '41123456',
  celtiisName: 'Ahouéfa Mensah',
  ifuNumber: '3202111854219',
  rccmNumber: 'RB/COT/21 A 12345',
  defaultFooter: 'Merci pour votre confiance ! Règlement par MTN MoMo ou Celtiis Cash.',
};

export const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  isSubscribed: false,
  freeReceiptsUsed: 1,
  maxFreeReceipts: 3,
  plan: 'FREE_TRIAL',
  priceMonthly: 1500,
};

export const SAMPLE_RECEIPT: Receipt = {
  id: 'sample-rec-1',
  receiptNumber: 'REC-2026-001',
  createdAt: new Date().toISOString(),
  seller: DEFAULT_SELLER_PROFILE,
  clientName: 'Mme Sèdami Koudjo',
  clientPhone: '+229 61 88 99 00',
  items: [
    {
      id: 'item-1',
      name: 'Robe Soirée Ankara Haute Couture',
      quantity: 1,
      unitPrice: 28000,
      total: 28000,
    },
    {
      id: 'item-2',
      name: 'Perruque Lace Frontal 100% Naturelle 24"',
      quantity: 1,
      unitPrice: 45000,
      total: 45000,
    },
    {
      id: 'item-3',
      name: 'Paire de Sandales Cuir Tressé Cotonou',
      quantity: 2,
      unitPrice: 8500,
      total: 17000,
    },
  ],
  totalAmount: 90000,
  advancePaid: 50000,
  balanceDue: 40000,
  status: 'PARTIAL',
  paymentMethod: 'MTN_MOMO',
  notes: 'Livraison prévue à domicile (Haie Vive, Cotonou). Reste à payer au fournisseur.',
  footerText: 'Merci pour votre confiance ! Règlement par MTN MoMo ou Celtiis Cash.',
};

export function getStoredSellerProfile(): SellerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SELLER_PROFILE);
    if (!raw) return DEFAULT_SELLER_PROFILE;
    const parsed = JSON.parse(raw);

    // If the saved profile had the developer's name as merchant, reset it so the vendor has full control
    const shopOwner = (parsed.shopOwner && parsed.shopOwner !== 'Clovis Arsène junior DOUBOGAN')
      ? parsed.shopOwner
      : DEFAULT_SELLER_PROFILE.shopOwner;

    const shopPhone = (parsed.shopPhone && !parsed.shopPhone.includes('01 57 58 63 08'))
      ? parsed.shopPhone
      : DEFAULT_SELLER_PROFILE.shopPhone;

    const momoNumber = (parsed.momoNumber && parsed.momoNumber !== '0157586308')
      ? parsed.momoNumber
      : (parsed.momoNumber || DEFAULT_SELLER_PROFILE.momoNumber);

    const momoName = (parsed.momoName && parsed.momoName !== 'Clovis Arsène junior DOUBOGAN')
      ? parsed.momoName
      : shopOwner;

    const celtiisNumber = (parsed.celtiisNumber && parsed.celtiisNumber !== '0141159129')
      ? parsed.celtiisNumber
      : (parsed.celtiisNumber || DEFAULT_SELLER_PROFILE.celtiisNumber);

    const celtiisName = (parsed.celtiisName && parsed.celtiisName !== 'Clovis Arsène junior DOUBOGAN')
      ? parsed.celtiisName
      : shopOwner;

    return {
      ...DEFAULT_SELLER_PROFILE,
      ...parsed,
      shopOwner,
      shopPhone,
      momoNumber,
      momoName,
      celtiisNumber,
      celtiisName,
    };
  } catch {
    return DEFAULT_SELLER_PROFILE;
  }
}

export function saveStoredSellerProfile(profile: SellerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SELLER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

export function getStoredReceipts(): Receipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (!raw) {
      const initial = [SAMPLE_RECEIPT];
      localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [SAMPLE_RECEIPT];
  }
}

export function saveStoredReceipts(receipts: Receipt[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  } catch (err) {
    console.error('Failed to save receipts', err);
  }
}

export function getStoredSubscription(): SubscriptionInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) return DEFAULT_SUBSCRIPTION;
    return { ...DEFAULT_SUBSCRIPTION, ...JSON.parse(raw), priceMonthly: 1500 };
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
}

export function saveStoredSubscription(sub: SubscriptionInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  } catch (err) {
    console.error('Failed to save subscription', err);
  }
}

export function getNextReceiptNumber(): string {
  try {
    const currentYear = new Date().getFullYear();
    const rawCount = localStorage.getItem(STORAGE_KEYS.COUNTER);
    let count = rawCount ? parseInt(rawCount, 10) : 2;
    if (isNaN(count)) count = 1;
    const padded = String(count).padStart(3, '0');
    return `REC-${currentYear}-${padded}`;
  } catch {
    return `REC-${new Date().getFullYear()}-001`;
  }
}

export function incrementReceiptCounter(): void {
  try {
    const rawCount = localStorage.getItem(STORAGE_KEYS.COUNTER);
    let count = rawCount ? parseInt(rawCount, 10) : 2;
    if (isNaN(count)) count = 1;
    localStorage.setItem(STORAGE_KEYS.COUNTER, String(count + 1));
  } catch (err) {
    console.error('Failed to increment counter', err);
  }
}

export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-BJ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export function formatDateFrench(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function normalizeBeninPhone(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, '');
  if (!clean) return '';
  if (clean.startsWith('+229')) return clean;
  if (clean.startsWith('229')) return `+${clean}`;
  if (clean.length === 8 || clean.length === 10) {
    return `+229${clean}`;
  }
  return clean;
}
