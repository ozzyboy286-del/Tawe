import React, { useState } from 'react';
import { X, Download, Share2, Printer, Edit3, CheckCircle, Loader2 } from 'lucide-react';
import { Receipt } from '../types/receipt';
import { ReceiptDocument } from './ReceiptDocument';
import { exportReceiptToPDF, printReceipt } from '../utils/pdfExport';
import { openWhatsAppChat } from '../utils/whatsapp';
import confetti from 'canvas-confetti';

interface ReceiptPreviewModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (receipt: Receipt) => void;
  onOpenPaymentModal: (operator: 'MTN' | 'CELTIIS') => void;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  receipt,
  isOpen,
  onClose,
  onEdit,
  onOpenPaymentModal,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  if (!isOpen || !receipt) return null;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setExportStatus('Génération du PDF...');
    try {
      const success = await exportReceiptToPDF('receipt-document', receipt, (status) => {
        setExportStatus(status);
      });
      if (success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  };

  const handleShareWhatsApp = () => {
    openWhatsAppChat(receipt);
  };

  const handlePrint = () => {
    printReceipt();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">
              Aperçu officiel : {receipt.receiptNumber}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(receipt);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Modifier</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {/* Download PDF button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>{exportStatus || 'Création du PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Télécharger PDF</span>
                </>
              )}
            </button>

            {/* WhatsApp button */}
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Envoyer sur WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Print button */}
            <button
              onClick={handlePrint}
              className="text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70">
          <ReceiptDocument
            receipt={receipt}
            onOpenPaymentModal={onOpenPaymentModal}
          />
        </div>
      </div>
    </div>
  );
};
