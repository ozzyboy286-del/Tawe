import React, { useState } from 'react';
import {
  Search,
  FileText,
  Eye,
  Download,
  Share2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  PlusCircle,
  TrendingUp,
  CreditCard,
  DollarSign,
  User,
  Calendar,
} from 'lucide-react';
import { Receipt } from '../types/receipt';
import { formatFCFA, formatDateFrench } from '../utils/storage';
import { openWhatsAppChat } from '../utils/whatsapp';

interface ReceiptHistoryProps {
  receipts: Receipt[];
  onSelectReceipt: (receipt: Receipt) => void;
  onEditReceipt: (receipt: Receipt) => void;
  onDeleteReceipt: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
  onDownloadPDF: (receipt: Receipt) => void;
  onNewReceipt: () => void;
}

export const ReceiptHistory: React.FC<ReceiptHistoryProps> = ({
  receipts,
  onSelectReceipt,
  onEditReceipt,
  onDeleteReceipt,
  onMarkAsPaid,
  onDownloadPDF,
  onNewReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PARTIAL' | 'UNPAID'>('ALL');

  // Filtered receipts
  const filteredReceipts = receipts.filter((rec) => {
    const matchesSearch =
      rec.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.clientPhone.includes(searchTerm) ||
      rec.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    return rec.status === statusFilter;
  });

  // Calculate statistics
  const totalRevenue = receipts.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalCollected = receipts.reduce((sum, r) => sum + (r.advancePaid || 0), 0);
  const totalPending = receipts.reduce((sum, r) => sum + (r.balanceDue || 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Historique de mes Reçus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Retrouvez tous vos reçus sauvegardés automatiquement sur votre appareil
          </p>
        </div>

        <button
          onClick={onNewReceipt}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Nouveau reçu</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Ventes
            </span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-900 font-bold text-xs">
              {receipts.length} reçu{receipts.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {formatFCFA(totalRevenue)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Total Encaissé
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            {formatFCFA(totalCollected)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Reste à Recouvrer
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
            {formatFCFA(totalPending)}
          </p>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom de client, n° de reçu, article..."
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous ({receipts.length})
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                statusFilter === 'PAID'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Soldés
            </button>
            <button
              onClick={() => setStatusFilter('PARTIAL')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                statusFilter === 'PARTIAL'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Acomptes
            </button>
            <button
              onClick={() => setStatusFilter('UNPAID')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                statusFilter === 'UNPAID'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Impayés
            </button>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      {filteredReceipts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Aucun reçu trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `Aucun reçu ne correspond à votre recherche "${searchTerm}".`
              : 'Commencez dès maintenant en générant votre premier reçu professionnel.'}
          </p>
          <button
            onClick={onNewReceipt}
            className="mt-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Créer un reçu en 10 secondes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReceipts.map((receipt) => {
            const isFullyPaid = receipt.status === 'PAID';
            const isPartial = receipt.status === 'PARTIAL';

            return (
              <div
                key={receipt.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-amber-300 px-2.5 py-0.5 rounded-md">
                      {receipt.receiptNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isFullyPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPartial
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isFullyPaid ? 'Payé' : isPartial ? 'Acompte' : 'Impayé'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDateFrench(receipt.createdAt)}
                    </span>
                  </div>

                  {/* Client & Items info */}
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {receipt.clientName}
                    </span>
                    {receipt.clientPhone && (
                      <span className="text-xs text-slate-500 font-medium">
                        ({receipt.clientPhone})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 truncate max-w-lg">
                    {receipt.items.map((it) => `${it.quantity}x ${it.name}`).join(' • ')}
                  </p>
                </div>

                {/* Financials & Status */}
                <div className="flex flex-col sm:items-end shrink-0">
                  <span className="text-base sm:text-lg font-black text-slate-900">
                    {formatFCFA(receipt.totalAmount)}
                  </span>
                  {receipt.balanceDue > 0 ? (
                    <span className="text-xs font-semibold text-rose-600">
                      Reste : {formatFCFA(receipt.balanceDue)}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Intégralement réglé</span>
                    </span>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                  {/* Mark as paid button if partial */}
                  {receipt.balanceDue > 0 && (
                    <button
                      onClick={() => onMarkAsPaid(receipt.id)}
                      className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                      title="Solder le paiement"
                    >
                      Solder
                    </button>
                  )}

                  {/* Preview button */}
                  <button
                    onClick={() => onSelectReceipt(receipt)}
                    className="p-2 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Aperçu & Détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Direct PDF */}
                  <button
                    onClick={() => onDownloadPDF(receipt)}
                    className="p-2 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Télécharger PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Direct WhatsApp */}
                  <button
                    onClick={() => openWhatsAppChat(receipt)}
                    className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Envoyer sur WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer le reçu ${receipt.receiptNumber} pour ${receipt.clientName} ?`)) {
                        onDeleteReceipt(receipt.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
