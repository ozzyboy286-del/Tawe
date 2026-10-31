import React, { useState } from 'react';
import {
  X,
  Store,
  Upload,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  FileText,
  CreditCard,
  Image as ImageIcon,
} from 'lucide-react';
import { SellerProfile } from '../types/receipt';

interface SellerProfileModalProps {
  profile: SellerProfile;
  onSave: (updated: SellerProfile) => void;
  onClose?: () => void;
  isStandaloneTab?: boolean;
}

const BENIN_CITIES = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
  'Ouidah',
  'Bohicon',
  'Natitingou',
  'Djougou',
  'Kandi',
  'Lokossa',
];

export const SellerProfileView: React.FC<SellerProfileModalProps> = ({
  profile,
  onSave,
  onClose,
  isStandaloneTab = false,
}) => {
  const [formData, setFormData] = useState<SellerProfile>(profile);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleChange = (field: keyof SellerProfile, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image trop lourde. Choisissez une image de moins de 2 Mo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      if (onClose && !isStandaloneTab) onClose();
    }, 1500);
  };

  const content = (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Paramètres de Ma Boutique
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ces informations apparaîtront automatiquement sur tous vos futurs reçus
          </p>
        </div>
        {savedFeedback && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Enregistré !</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SHOP ESSENTIALS */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm sm:text-base">
            <Store className="w-4 h-4 text-amber-600" />
            <span>Identité Commerciale</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom de la boutique <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => handleChange('shopName', e.target.value)}
                placeholder="Ex: Boutique Divine Cotonou"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom du Responsable / Fournisseur (celui qui vend) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.shopOwner}
                onChange={(e) => handleChange('shopOwner', e.target.value)}
                placeholder="Ex: Mme Ahouéfa Mensah, M. Bio..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro de fonction / Contact professionnel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.shopPhone}
                onChange={(e) => handleChange('shopPhone', e.target.value)}
                placeholder="+229 97 25 40 18"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ville au Bénin
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {BENIN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse physique ou quartier
              </label>
              <input
                type="text"
                value={formData.shopAddress}
                onChange={(e) => handleChange('shopAddress', e.target.value)}
                placeholder="Ex: Marché Dantokpa, Allée des Tissus ou Cadjèhoun, Rue 102"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Logo Setting */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Logo officiel
            </label>
            <div className="flex items-center gap-4">
              {formData.logoUrl ? (
                <div className="w-16 h-16 rounded-xl border border-slate-300 p-1 bg-white shadow-2xs flex items-center justify-center">
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6 stroke-1" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{formData.logoUrl ? 'Changer' : 'Téléverser'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => handleChange('logoUrl', null)}
                    className="text-xs text-rose-600 hover:underline px-2"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MONEY NUMBERS */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm sm:text-base">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Numéros Mobile Money du Vendeur (Bénin)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-amber-400 font-bold text-[9px] flex items-center justify-center">
                  M
                </span>
                <span>MTN Mobile Money (MoMo)</span>
              </span>
              <input
                type="text"
                value={formData.momoNumber}
                onChange={(e) => handleChange('momoNumber', e.target.value)}
                placeholder="Ex: 97 25 40 18"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-bold"
              />
              <input
                type="text"
                value={formData.momoName}
                onChange={(e) => handleChange('momoName', e.target.value)}
                placeholder="Nom sur le compte MoMo (ex: Ahouéfa Mensah)"
                className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-amber-300 text-slate-700"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-sky-600 text-white font-bold text-[9px] flex items-center justify-center">
                  C
                </span>
                <span>Celtiis Cash Bénin</span>
              </span>
              <input
                type="text"
                value={formData.celtiisNumber}
                onChange={(e) => handleChange('celtiisNumber', e.target.value)}
                placeholder="Ex: 41 12 34 56"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-sky-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono font-bold"
              />
              <input
                type="text"
                value={formData.celtiisName}
                onChange={(e) => handleChange('celtiisName', e.target.value)}
                placeholder="Nom sur le compte Celtiis (ex: Ahouéfa Mensah)"
                className="w-full text-xs px-3 py-1.5 bg-white rounded-lg border border-sky-300 text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FISCAL / LEGAL OPTIONAL */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm sm:text-base">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Mentions Légales & Pied de page</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro IFU Bénin (Optionnel)
              </label>
              <input
                type="text"
                value={formData.ifuNumber || ''}
                onChange={(e) => handleChange('ifuNumber', e.target.value)}
                placeholder="Ex: 3202111854219"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro RCCM (Optionnel)
              </label>
              <input
                type="text"
                value={formData.rccmNumber || ''}
                onChange={(e) => handleChange('rccmNumber', e.target.value)}
                placeholder="Ex: RB/COT/21 A 12345"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pied de page par défaut des reçus
              </label>
              <input
                type="text"
                value={formData.defaultFooter}
                onChange={(e) => handleChange('defaultFooter', e.target.value)}
                placeholder="Merci pour votre confiance !"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && !isStandaloneTab && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Enregistrer les paramètres de ma boutique</span>
          </button>
        </div>
      </form>
    </div>
  );

  return content;
};
