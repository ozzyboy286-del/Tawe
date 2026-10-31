import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  Eye,
  Download,
  Share2,
  Sparkles,
  Store,
  User,
  Calculator,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  X,
  CreditCard,
  FileCheck,
  Crown,
  Zap,
  Lock,
} from 'lucide-react';
import { Receipt, ReceiptItem, SellerProfile } from '../types/receipt';
import { formatFCFA, getNextReceiptNumber, normalizeBeninPhone } from '../utils/storage';

interface ReceiptFormProps {
  initialReceipt?: Receipt | null;
  sellerProfile: SellerProfile;
  onSaveSellerProfile: (profile: SellerProfile) => void;
  onPreview: (receipt: Receipt) => void;
  onDownloadPDF: (receipt: Receipt) => void;
  onSendWhatsApp: (receipt: Receipt) => void;
  onSaveAndNew: (receipt: Receipt) => void;
  canCreateMore: boolean;
  onOpenSubscription: () => void;
}

const QUICK_SUGGESTIONS = [
  { name: 'Robe en pagne Wax Vlisco', price: 25000 },
  { name: 'Perruque Lace Frontal 22"', price: 40000 },
  { name: 'Escarpins chic Cotonou', price: 15000 },
  { name: 'Ensemble tailleur dame', price: 30000 },
  { name: 'Frais de livraison (Cotonou / Calavi)', price: 1500 },
];

export const ReceiptForm: React.FC<ReceiptFormProps> = ({
  initialReceipt,
  sellerProfile,
  onSaveSellerProfile,
  onPreview,
  onDownloadPDF,
  onSendWhatsApp,
  onSaveAndNew,
  canCreateMore,
  onOpenSubscription,
}) => {
  // Shop & Seller (Fournisseur) details
  const [shopName, setShopName] = useState(initialReceipt?.seller.shopName || sellerProfile.shopName || '');
  const [shopOwner, setShopOwner] = useState(initialReceipt?.seller.shopOwner || sellerProfile.shopOwner || '');
  const [shopPhone, setShopPhone] = useState(initialReceipt?.seller.shopPhone || sellerProfile.shopPhone || '');
  const [logoUrl, setLogoUrl] = useState<string | null>(initialReceipt?.seller.logoUrl || sellerProfile.logoUrl || null);
  const [momoNumber, setMomoNumber] = useState(initialReceipt?.seller.momoNumber || sellerProfile.momoNumber || '');
  const [momoName, setMomoName] = useState(initialReceipt?.seller.momoName || sellerProfile.momoName || '');
  const [celtiisNumber, setCeltiisNumber] = useState(initialReceipt?.seller.celtiisNumber || sellerProfile.celtiisNumber || '');
  const [celtiisName, setCeltiisName] = useState(initialReceipt?.seller.celtiisName || sellerProfile.celtiisName || '');

  // Client details
  const [clientName, setClientName] = useState(initialReceipt?.clientName || '');
  const [clientPhone, setClientPhone] = useState(initialReceipt?.clientPhone || '');

  // Dynamic items list
  const [items, setItems] = useState<ReceiptItem[]>(
    initialReceipt?.items || [
      { id: '1', name: '', quantity: 1, unitPrice: 0, total: 0 },
    ]
  );

  // Financials
  const [advancePaid, setAdvancePaid] = useState<number>(initialReceipt?.advancePaid || 0);
  const [paymentMethod, setPaymentMethod] = useState<Receipt['paymentMethod']>(
    initialReceipt?.paymentMethod || 'MTN_MOMO'
  );
  const [notes, setNotes] = useState(initialReceipt?.notes || '');
  const [footerText, setFooterText] = useState(
    initialReceipt?.footerText || sellerProfile.defaultFooter || 'Merci pour votre confiance !'
  );
  const [receiptNumber, setReceiptNumber] = useState(
    initialReceipt?.receiptNumber || getNextReceiptNumber()
  );

  // Auto-calculated totals
  const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const balanceDue = Math.max(0, totalAmount - (advancePaid || 0));

  // Determine status
  const getStatus = (): Receipt['status'] => {
    if (totalAmount > 0 && advancePaid >= totalAmount) return 'PAID';
    if (advancePaid > 0 && advancePaid < totalAmount) return 'PARTIAL';
    return 'UNPAID';
  };

  // Sync state if initialReceipt changes
  useEffect(() => {
    if (initialReceipt) {
      setShopName(initialReceipt.seller.shopName);
      setShopOwner(initialReceipt.seller.shopOwner || '');
      setShopPhone(initialReceipt.seller.shopPhone);
      setLogoUrl(initialReceipt.seller.logoUrl);
      setMomoNumber(initialReceipt.seller.momoNumber || '');
      setMomoName(initialReceipt.seller.momoName || '');
      setCeltiisNumber(initialReceipt.seller.celtiisNumber || '');
      setCeltiisName(initialReceipt.seller.celtiisName || '');
      setClientName(initialReceipt.clientName);
      setClientPhone(initialReceipt.clientPhone);
      setItems(initialReceipt.items);
      setAdvancePaid(initialReceipt.advancePaid);
      setPaymentMethod(initialReceipt.paymentMethod);
      setNotes(initialReceipt.notes || '');
      setFooterText(initialReceipt.footerText);
      setReceiptNumber(initialReceipt.receiptNumber);
    }
  }, [initialReceipt]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Le logo est trop volumineux. Veuillez choisir une image de moins de 2 Mo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setLogoUrl(base64);
        // Also update seller profile
        onSaveSellerProfile({
          ...sellerProfile,
          shopName,
          logoUrl: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle item change
  const handleItemChange = (index: number, field: keyof ReceiptItem, value: any) => {
    const updated = [...items];
    const target = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Math.max(1, Number(value) || 1) : target.quantity;
      const p = field === 'unitPrice' ? Math.max(0, Number(value) || 0) : target.unitPrice;
      target.quantity = q;
      target.unitPrice = p;
      target.total = q * p;
    }

    updated[index] = target;
    setItems(updated);
  };

  // Add Item
  const handleAddItem = (name = '', unitPrice = 0) => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substring(2, 9),
        name,
        quantity: 1,
        unitPrice,
        total: unitPrice,
      },
    ]);
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      setItems([{ id: '1', name: '', quantity: 1, unitPrice: 0, total: 0 }]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const [actionLoading, setActionLoading] = useState<'preview' | 'pdf' | 'whatsapp' | null>(null);
  const [formFeedback, setFormFeedback] = useState<string | null>(null);

  // Build current receipt object
  const constructReceipt = (): Receipt => {
    // Ensure at least one valid item
    const validItems = items.filter((it) => it.name.trim() !== '' || it.unitPrice > 0);
    const finalItems: ReceiptItem[] =
      validItems.length > 0
        ? validItems.map((it, idx) => ({
            ...it,
            name: it.name.trim() || `Article #${idx + 1}`,
            unitPrice: Number(it.unitPrice) || 0,
            quantity: Math.max(1, Number(it.quantity) || 1),
            total: (Number(it.unitPrice) || 0) * Math.max(1, Number(it.quantity) || 1),
          }))
        : [
            {
              id: 'item-def-1',
              name: 'Article / Prestation commerciale',
              quantity: 1,
              unitPrice: 15000,
              total: 15000,
            },
          ];

    const computedTotal = finalItems.reduce((sum, it) => sum + it.total, 0);
    const computedAdvance = Math.min(computedTotal, Number(advancePaid) || 0);
    const computedBalance = Math.max(0, computedTotal - computedAdvance);

    let computedStatus: Receipt['status'] = 'UNPAID';
    if (computedTotal > 0 && computedAdvance >= computedTotal) {
      computedStatus = 'PAID';
    } else if (computedAdvance > 0) {
      computedStatus = 'PARTIAL';
    }

    const updatedSeller: SellerProfile = {
      ...sellerProfile,
      shopName: shopName.trim() || sellerProfile.shopName || 'Boutique Commerciale',
      shopOwner: shopOwner.trim() || sellerProfile.shopOwner || 'Responsable des ventes',
      shopPhone: shopPhone.trim() || sellerProfile.shopPhone || '',
      logoUrl: logoUrl,
      momoNumber: momoNumber.trim() || sellerProfile.momoNumber || '',
      momoName: momoName.trim() || shopOwner.trim() || sellerProfile.momoName || '',
      celtiisNumber: celtiisNumber.trim() || sellerProfile.celtiisNumber || '',
      celtiisName: celtiisName.trim() || shopOwner.trim() || sellerProfile.celtiisName || '',
    };

    return {
      id: initialReceipt?.id || `rec_${Date.now()}`,
      receiptNumber: receiptNumber || getNextReceiptNumber(),
      createdAt: initialReceipt?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seller: updatedSeller,
      clientName: clientName.trim() || 'Client(e) Comptant',
      clientPhone: clientPhone ? normalizeBeninPhone(clientPhone) : '',
      items: finalItems,
      totalAmount: computedTotal,
      advancePaid: computedAdvance,
      balanceDue: computedBalance,
      status: computedStatus,
      paymentMethod,
      notes: notes.trim(),
      footerText: footerText.trim() || 'Merci pour votre confiance !',
    };
  };

  const handlePreviewClick = () => {
    if (!canCreateMore && !initialReceipt) {
      setFormFeedback("Vos 3 reçus d'essai gratuits sont épuisés. Activez votre formule PRO illimitée à 1 500 FCFA / mois pour continuer.");
      onOpenSubscription();
      return;
    }
    setActionLoading('preview');
    setFormFeedback('Ouverture de l\'aperçu...');
    const receipt = constructReceipt();
    setTimeout(() => {
      onPreview(receipt);
      setActionLoading(null);
      setFormFeedback(null);
    }, 150);
  };

  const handleDownloadClick = () => {
    if (!canCreateMore && !initialReceipt) {
      setFormFeedback("Vos 3 reçus d'essai gratuits sont épuisés. Activez votre formule PRO illimitée à 1 500 FCFA / mois pour continuer.");
      onOpenSubscription();
      return;
    }
    setActionLoading('pdf');
    setFormFeedback('Génération et téléchargement du PDF...');
    const receipt = constructReceipt();
    setTimeout(() => {
      onDownloadPDF(receipt);
      setActionLoading(null);
      setFormFeedback(null);
    }, 150);
  };

  const handleWhatsAppClick = () => {
    if (!canCreateMore && !initialReceipt) {
      setFormFeedback("Vos 3 reçus d'essai gratuits sont épuisés. Activez votre formule PRO illimitée à 1 500 FCFA / mois pour continuer.");
      onOpenSubscription();
      return;
    }
    setActionLoading('whatsapp');
    setFormFeedback('Préparation du message WhatsApp...');
    const receipt = constructReceipt();
    setTimeout(() => {
      onSendWhatsApp(receipt);
      setActionLoading(null);
      setFormFeedback(null);
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
            {initialReceipt ? 'Modification de reçu' : 'Nouveau Reçu Express'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Reçu N° <span className="text-blue-900">{receiptNumber}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddItem('', 0)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une ligne</span>
          </button>
        </div>
      </div>

      {/* Trial Exhausted Lockout Banner */}
      {!canCreateMore && !initialReceipt && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 text-white p-5 sm:p-6 rounded-2xl border-2 border-rose-500 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Essai gratuit épuisé (3 / 3 reçus utilisés)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Débloquez la génération illimitée à 1 500 FCFA / mois
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Les 3 reçus d'essai sont épuisés. Pour continuer à générer des reçus professionnels sans restriction, activez votre abonnement mensuel via MTN MoMo ou Celtiis Cash.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSubscription}
            className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Payer 1 500 F/mois</span>
          </button>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* SECTION 1: SHOP & SUPPLIER (FOURNISSEUR) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
              <Store className="w-4 h-4 text-amber-600" />
              <span>1. Vendeur & Responsable (Fournisseur)</span>
            </div>
            <span className="text-[11px] text-slate-400">Vos coordonnées sur le reçu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom du Responsable / Fournisseur */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Nom du Responsable / Fournisseur <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded">Celui qui vend</span>
              </label>
              <input
                type="text"
                value={shopOwner}
                onChange={(e) => setShopOwner(e.target.value)}
                placeholder="Ex: Mme Ahouéfa Mensah, M. Bio, etc."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium"
                required
              />
            </div>

            {/* Numéro de fonction / Contact pro */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Numéro de fonction / Contact professionnel <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-blue-700 font-medium bg-blue-50 px-1.5 py-0.5 rounded">Appels & WhatsApp</span>
              </label>
              <input
                type="text"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                placeholder="Ex: +229 97 00 11 22 ou 01..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono"
                required
              />
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom de la boutique / Établissement
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Ex: Boutique Divine Cotonou, Élégance Wax, etc."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Logo Upload Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Logo de la boutique (optionnel)
              </label>
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <div className="relative w-11 h-11 rounded-xl border border-slate-200 p-0.5 bg-white shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src={logoUrl}
                      alt="Logo boutique"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setLogoUrl(null)}
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-0.5 rounded-full shadow-xs"
                      title="Supprimer le logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <ImageIcon className="w-4 h-4 stroke-1" />
                  </div>
                )}

                <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-blue-900" />
                  <span>{logoUrl ? 'Changer logo' : 'Téléverser logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Money numbers for direct payments */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Numéros Mobile Money du Fournisseur (pour recevoir l'argent de vos ventes) :
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* MTN MoMo of the vendor */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 font-bold text-[9px] flex items-center justify-center">
                    M
                  </span>
                  <span>MTN MoMo du Vendeur</span>
                </span>
                <input
                  type="text"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="Numéro MoMo (ex: 97 00 11 22)"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={momoName}
                  onChange={(e) => setMomoName(e.target.value)}
                  placeholder="Nom sur le compte MoMo (ex: Ahouéfa Mensah)"
                  className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-amber-300 text-slate-700"
                />
              </div>

              {/* Celtiis Cash of the vendor */}
              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white font-bold text-[9px] flex items-center justify-center">
                    C
                  </span>
                  <span>Celtiis Cash du Vendeur</span>
                </span>
                <input
                  type="text"
                  value={celtiisNumber}
                  onChange={(e) => setCeltiisNumber(e.target.value)}
                  placeholder="Numéro Celtiis (ex: 41 00 22 33)"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-sky-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={celtiisName}
                  onChange={(e) => setCeltiisName(e.target.value)}
                  placeholder="Nom sur le compte Celtiis (ex: Ahouéfa Mensah)"
                  className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-sky-300 text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CLIENT DETAILS */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm sm:text-base">
            <User className="w-4 h-4 text-amber-600" />
            <span>2. Informations du Client</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom du client <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Mme Sèdami Koudjo, M. Bio..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Téléphone WhatsApp (pour l'envoi direct)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ex: 97 00 11 22 ou +229 61..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DYNAMIC ARTICLES LIST */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>3. Liste des Articles & Prestations</span>
            </div>

            {/* Quick suggestion pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Suggestions rapides :</span>
              {QUICK_SUGGESTIONS.slice(0, 2).map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddItem(sug.name, sug.price)}
                  className="text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                >
                  + {sug.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table / Mobile Card Layout */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 grid grid-cols-12 gap-2.5 sm:gap-3 items-center"
              >
                {/* Designation */}
                <div className="col-span-12 sm:col-span-5">
                  <label className="block sm:hidden text-[11px] font-semibold text-slate-500 mb-1">
                    Désignation de l'article #{index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="Ex: Robe Wax, Perruque, Chaussure..."
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block sm:hidden text-[11px] font-semibold text-slate-500 mb-1">
                    Qté
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full text-xs sm:text-sm px-2.5 py-2 bg-white rounded-lg border border-slate-200 text-center focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold"
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-4 sm:col-span-3">
                  <label className="block sm:hidden text-[11px] font-semibold text-slate-500 mb-1">
                    Prix Unit. (FCFA)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      placeholder="0"
                      className="w-full text-xs sm:text-sm px-2.5 py-2 bg-white rounded-lg border border-slate-200 text-right focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Item Total & Delete */}
                <div className="col-span-4 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                  <div className="text-right">
                    <span className="block sm:hidden text-[10px] text-slate-400">Total</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                      {formatFCFA(item.total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer cette ligne"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={() => handleAddItem('', 0)}
            className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl text-xs sm:text-sm font-semibold text-blue-900 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un autre article</span>
          </button>
        </div>

        {/* SECTION 4: TOTALS, ADVANCE PAID & BALANCE DUE */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm sm:text-base">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>4. Règlement & Calcul Automatique</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total General (Auto) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total des articles
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {formatFCFA(totalAmount)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Calculé automatiquement
              </span>
            </div>

            {/* Advance Paid (Input) */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
                Avance payée (FCFA)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={advancePaid || ''}
                onChange={(e) => setAdvancePaid(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full text-lg sm:text-xl font-bold px-3 py-1.5 bg-white rounded-lg border border-amber-300 text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setAdvancePaid(totalAmount)}
                  className="text-[11px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded font-semibold cursor-pointer"
                >
                  Payé en totalité
                </button>
                <button
                  type="button"
                  onClick={() => setAdvancePaid(Math.round(totalAmount / 2))}
                  className="text-[11px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded font-semibold cursor-pointer"
                >
                  Acompte 50%
                </button>
              </div>
            </div>

            {/* Balance Due (Auto) */}
            <div
              className={`p-4 rounded-xl border ${
                balanceDue > 0
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider block ${
                  balanceDue > 0 ? 'text-rose-900' : 'text-emerald-900'
                }`}
              >
                Reste à payer
              </span>
              <p
                className={`text-xl sm:text-2xl font-black mt-1 ${
                  balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {formatFCFA(balanceDue)}
              </p>
              <span
                className={`text-[11px] font-semibold mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  balanceDue === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : advancePaid > 0
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {balanceDue === 0 ? 'Facture Soldée (PAYÉ)' : advancePaid > 0 ? 'Acompte Versé' : 'Impayé'}
              </span>
            </div>
          </div>

          {/* Payment Method & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Moyen de règlement</span>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                  2 méthodes uniques (MTN & Celtiis)
                </span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="MTN_MOMO">MTN Mobile Money (01 57 58 63 08)</option>
                <option value="CELTIIS_CASH">Celtiis Cash Bénin (01 41 15 91 29)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Note ou modalité particulière (optionnel)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Livraison samedi 14h à Akpakpa"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Automatic Footer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pied de page automatique du reçu
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="Merci pour votre confiance !"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* SECTION 5: ACTION BUTTONS (MANDATORY REQUIREMENT) */}
        {/* Buttons: "Prévisualiser", "Télécharger PDF", "Envoyer sur WhatsApp" */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Actions directes sur le reçu
            </span>
            <span className="text-xs text-slate-400">
              Prêt pour impression ou envoi
            </span>
          </div>

          {formFeedback && (
            <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-400 text-blue-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{formFeedback}</span>
            </div>
          )}

          {!canCreateMore && !initialReceipt ? (
            <div className="bg-rose-950/80 border border-rose-500/80 rounded-xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Génération verrouillée (3 reçus d'essai épuisés)</span>
              </div>
              <p className="text-xs text-slate-300">
                Abonnez-vous pour seulement <strong>1 500 FCFA / mois</strong> pour débloquer la génération illimitée de reçus, le téléchargement PDF et l'envoi WhatsApp.
              </p>
              <button
                type="button"
                onClick={onOpenSubscription}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Activer la formule illimitée à 1 500 FCFA / mois</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Prévisualiser */}
              <button
                type="button"
                onClick={handlePreviewClick}
                disabled={actionLoading !== null}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl border border-slate-700 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>{actionLoading === 'preview' ? 'Chargement...' : 'Prévisualiser'}</span>
              </button>

              {/* 2. Télécharger PDF */}
              <button
                type="button"
                onClick={handleDownloadClick}
                disabled={actionLoading !== null}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-900/30 transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4 text-white" />
                <span>{actionLoading === 'pdf' ? 'Téléchargement...' : 'Télécharger PDF'}</span>
              </button>

              {/* 3. Envoyer sur WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={actionLoading !== null}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-900/30 transition-all cursor-pointer active:scale-98"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span>{actionLoading === 'whatsapp' ? 'Envoi...' : 'Envoyer sur WhatsApp'}</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Sauvegarde automatique dans l'historique local</span>
            <span className="text-amber-400/90 font-medium">Reçu Pro Bénin</span>
          </div>
        </div>
      </form>
    </div>
  );
};
