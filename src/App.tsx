import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroHome } from './components/HeroHome';
import { ReceiptForm } from './components/ReceiptForm';
import { ReceiptHistory } from './components/ReceiptHistory';
import { SellerProfileView } from './components/SellerProfileModal';
import { ReceiptPreviewModal } from './components/ReceiptPreviewModal';
import { PaymentModal } from './components/PaymentModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SupportAuthorModal } from './components/SupportAuthorModal';
import { CreatorBadge } from './components/CreatorBadge';
import { BottomNavBar } from './components/BottomNavBar';
import { Receipt, SellerProfile, SubscriptionInfo } from './types/receipt';
import {
  getStoredSellerProfile,
  saveStoredSellerProfile,
  getStoredReceipts,
  saveStoredReceipts,
  getStoredSubscription,
  saveStoredSubscription,
  incrementReceiptCounter,
} from './utils/storage';
import { exportReceiptToPDF } from './utils/pdfExport';
import { openWhatsAppChat } from './utils/whatsapp';
import confetti from 'canvas-confetti';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'create' | 'history' | 'profile' | 'subscription'>('home');
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(getStoredSellerProfile());
  const [receipts, setReceipts] = useState<Receipt[]>(getStoredReceipts());
  const [subscription, setSubscription] = useState<SubscriptionInfo>(getStoredSubscription());

  // Modal states
  const [previewReceipt, setPreviewReceipt] = useState<Receipt | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    receipt: Receipt | null;
    operator: 'MTN' | 'CELTIIS';
  }>({
    isOpen: false,
    receipt: null,
    operator: 'MTN',
  });

  // Current editing state for ReceiptForm
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);

  // Persistence effects
  useEffect(() => {
    saveStoredSellerProfile(sellerProfile);
  }, [sellerProfile]);

  useEffect(() => {
    saveStoredReceipts(receipts);
  }, [receipts]);

  useEffect(() => {
    saveStoredSubscription(subscription);
  }, [subscription]);

  // Subscription verification check
  const canCreateMore = subscription.isSubscribed || subscription.freeReceiptsUsed < subscription.maxFreeReceipts;

  // Save new or updated receipt
  const handleSaveReceipt = (receipt: Receipt) => {
    const existingIndex = receipts.findIndex((r) => r.id === receipt.id);
    let updatedReceipts: Receipt[];

    if (existingIndex >= 0) {
      // Update existing
      updatedReceipts = [...receipts];
      updatedReceipts[existingIndex] = receipt;
    } else {
      // Create new - check trial limit
      if (!canCreateMore) {
        setIsSubscriptionModalOpen(true);
        return;
      }

      updatedReceipts = [receipt, ...receipts];
      incrementReceiptCounter();

      // If on free trial, increment count
      if (!subscription.isSubscribed) {
        setSubscription((prev) => ({
          ...prev,
          freeReceiptsUsed: prev.freeReceiptsUsed + 1,
        }));
      }
    }

    setReceipts(updatedReceipts);
    setSellerProfile(receipt.seller);
    setPreviewReceipt(receipt);
    setIsPreviewOpen(true);
  };

  // Preview directly from form
  const handlePreview = (receipt: Receipt) => {
    handleSaveReceipt(receipt);
  };

  // Download PDF directly from form
  const handleDownloadPDF = async (receipt: Receipt) => {
    handleSaveReceipt(receipt);
    setTimeout(async () => {
      try {
        await exportReceiptToPDF('receipt-document', receipt);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (err) {
        console.error('Error generating PDF:', err);
      }
    }, 250);
  };

  // WhatsApp share directly from form
  const handleSendWhatsApp = (receipt: Receipt) => {
    handleSaveReceipt(receipt);
    openWhatsAppChat(receipt);
  };

  // Mark as paid in history
  const handleMarkAsPaid = (id: string) => {
    const updated = receipts.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          advancePaid: r.totalAmount,
          balanceDue: 0,
          status: 'PAID' as const,
        };
      }
      return r;
    });
    setReceipts(updated);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Delete receipt
  const handleDeleteReceipt = (id: string) => {
    setReceipts(receipts.filter((r) => r.id !== id));
  };

  // Handle successful payment in simulation
  const handlePaymentSuccess = (receiptId: string, amountPaid: number) => {
    const updated = receipts.map((r) => {
      if (r.id === receiptId) {
        const newAdvance = (r.advancePaid || 0) + amountPaid;
        const newBalance = Math.max(0, r.totalAmount - newAdvance);
        return {
          ...r,
          advancePaid: newAdvance,
          balanceDue: newBalance,
          status: newBalance === 0 ? ('PAID' as const) : ('PARTIAL' as const),
        };
      }
      return r;
    });
    setReceipts(updated);
    if (previewReceipt && previewReceipt.id === receiptId) {
      const newAdvance = (previewReceipt.advancePaid || 0) + amountPaid;
      const newBalance = Math.max(0, previewReceipt.totalAmount - newAdvance);
      setPreviewReceipt({
        ...previewReceipt,
        advancePaid: newAdvance,
        balanceDue: newBalance,
        status: newBalance === 0 ? 'PAID' : 'PARTIAL',
      });
    }
  };

  // Handle subscription confirmation
  const handleSubscribeSuccess = () => {
    setSubscription({
      ...subscription,
      isSubscribed: true,
      plan: 'PRO_MONTHLY',
      subscriptionDate: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans w-full antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'subscription') {
            setIsSubscriptionModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        subscription={subscription}
        receiptsCount={receipts.length}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Main Content View Switcher - Fluid and Responsive */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 pt-4 pb-28 md:pb-12">
        {currentTab === 'home' && (
          <HeroHome
            onStartCreate={() => {
              if (!canCreateMore) {
                setIsSubscriptionModalOpen(true);
              } else {
                setEditingReceipt(null);
                setCurrentTab('create');
              }
            }}
            onViewHistory={() => setCurrentTab('history')}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
            onOpenSupportModal={() => setIsSupportModalOpen(true)}
            receiptsCount={receipts.length}
            canCreateMore={canCreateMore}
          />
        )}

        {currentTab === 'create' && (
          <ReceiptForm
            initialReceipt={editingReceipt}
            sellerProfile={sellerProfile}
            onSaveSellerProfile={setSellerProfile}
            onPreview={handlePreview}
            onDownloadPDF={handleDownloadPDF}
            onSendWhatsApp={handleSendWhatsApp}
            onSaveAndNew={(r) => {
              handleSaveReceipt(r);
              setEditingReceipt(null);
            }}
            canCreateMore={canCreateMore}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {currentTab === 'history' && (
          <ReceiptHistory
            receipts={receipts}
            onSelectReceipt={(receipt) => {
              setPreviewReceipt(receipt);
              setIsPreviewOpen(true);
            }}
            onEditReceipt={(receipt) => {
              setEditingReceipt(receipt);
              setCurrentTab('create');
            }}
            onDeleteReceipt={handleDeleteReceipt}
            onMarkAsPaid={handleMarkAsPaid}
            onDownloadPDF={(receipt) => {
              setPreviewReceipt(receipt);
              setIsPreviewOpen(true);
              setTimeout(async () => {
                await exportReceiptToPDF('receipt-document', receipt);
              }, 250);
            }}
            onNewReceipt={() => {
              if (!canCreateMore) {
                setIsSubscriptionModalOpen(true);
              } else {
                setEditingReceipt(null);
                setCurrentTab('create');
              }
            }}
          />
        )}

        {currentTab === 'profile' && (
          <SellerProfileView
            profile={sellerProfile}
            onSave={(updated) => {
              setSellerProfile(updated);
            }}
            isStandaloneTab={true}
          />
        )}
      </main>

      {/* Preview Modal */}
      <ReceiptPreviewModal
        receipt={previewReceipt}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={(rec) => {
          setEditingReceipt(rec);
          setCurrentTab('create');
        }}
        onOpenPaymentModal={(operator) => {
          setPaymentModalState({
            isOpen: true,
            receipt: previewReceipt,
            operator,
          });
        }}
      />

      {/* Mobile Money Operator Modal (MTN MoMo / Celtiis Cash) */}
      <PaymentModal
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState((prev) => ({ ...prev, isOpen: false }))}
        receipt={paymentModalState.receipt}
        defaultOperator={paymentModalState.operator}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Subscription Modal (MTN MoMo / Celtiis Cash) */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscription={subscription}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      {/* Support Author Modal (Donations / Support Clovis Arsène junior DOUBOGAN) */}
      <SupportAuthorModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Footer with Creator Credit and Support Phrasing */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <CreatorBadge compact={true} onOpenSupport={() => setIsSupportModalOpen(true)} />
        </div>
      </footer>

      {/* Native Mobile Bottom Navigation Bar: visible on smartphones, hidden on md/desktop */}
      <BottomNavBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        receiptsCount={receipts.length}
        subscription={subscription}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />
    </div>
  );
}

export default App;
