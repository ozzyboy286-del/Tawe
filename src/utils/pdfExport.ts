import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { Receipt } from '../types/receipt';
import { formatFCFA, formatDateFrench } from './storage';

/**
 * Creates an exact, pristine, non-clipped A4 HTML element offscreen (width: 794px = 210mm at 96 DPI)
 * specifically designed to render perfectly into canvas and PDF without any mobile viewport cropping.
 */
function createPrintableDOMNode(receipt: Receipt): HTMLElement {
  const seller = receipt.seller;
  const container = document.createElement('div');
  container.id = 'offscreen-pdf-print-root';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // Exact A4 width at standard web DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Poppins', system-ui, -apple-system, sans-serif";
  container.style.boxSizing = 'border-box';
  container.style.padding = '32px';
  container.style.zIndex = '-9999';

  const stampColor =
    receipt.status === 'PAID' ? '#16a34a' : receipt.status === 'PARTIAL' ? '#d97706' : '#dc2626';
  const stampBg =
    receipt.status === 'PAID' ? '#f0fdf4' : receipt.status === 'PARTIAL' ? '#fffbeb' : '#fef2f2';
  const stampTitle =
    receipt.status === 'PAID'
      ? '★ PAYÉ ★'
      : receipt.status === 'PARTIAL'
      ? '★ ACOMPTE VERSÉ ★'
      : '★ IMPAYÉ ★';
  const stampSub =
    receipt.status === 'PAID'
      ? 'FACTURE SOLDÉE'
      : receipt.status === 'PARTIAL'
      ? `RESTE : ${formatFCFA(receipt.balanceDue)}`
      : 'EN ATTENTE DE RÈGLEMENT';

  let itemsRowsHtml = '';
  receipt.items.forEach((item, index) => {
    const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    itemsRowsHtml += `
      <tr style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; text-align: center; color: #64748b; font-size: 12px;">${index + 1}</td>
        <td style="padding: 10px 12px; font-weight: 600; font-size: 13px; color: #1e293b;">${item.name}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; font-size: 13px; color: #334155;">${item.quantity}</td>
        <td style="padding: 10px 12px; text-align: right; font-size: 13px; color: #475569;">${formatFCFA(item.unitPrice)}</td>
        <td style="padding: 10px 12px; text-align: right; font-weight: 700; font-size: 13px; color: #0f172a;">${formatFCFA(item.total)}</td>
      </tr>
    `;
  });

  const logoHtml = seller.logoUrl
    ? `<img src="${seller.logoUrl}" style="max-height: 70px; max-width: 90px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 2px;" />`
    : `<div style="width: 65px; height: 65px; background-color: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; border-radius: 12px;">${(seller.shopName || 'RP').substring(0, 2).toUpperCase()}</div>`;

  container.innerHTML = `
    <div style="border: 2px solid #0f172a; border-radius: 16px; padding: 28px; background-color: #ffffff; position: relative;">
      <!-- Benin National Ribbon -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #16a34a 0%, #f59e0b 50%, #dc2626 100%); border-top-left-radius: 14px; border-top-right-radius: 14px;"></div>

      <!-- HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; margin-top: 6px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          ${logoHtml}
          <div>
            <h1 style="font-size: 22px; font-weight: 900; margin: 0; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px;">
              ${seller.shopName || 'Boutique Commerciale'}
            </h1>
            ${seller.shopOwner ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #334155;">Responsable / Fournisseur : <strong style="color: #0f172a;">${seller.shopOwner}</strong></p>` : ''}
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #475569;">
              📞 Contact / N° de fonction : <strong style="color: #0f172a; font-family: monospace;">${seller.shopPhone || 'Non renseigné'}</strong> • 📍 ${seller.shopAddress ? `${seller.shopAddress}, ` : ''}${seller.city || 'Cotonou'} (Bénin)
            </p>
            ${seller.ifuNumber ? `<p style="margin: 2px 0 0 0; font-size: 10px; color: #94a3b8;">IFU : ${seller.ifuNumber} ${seller.rccmNumber ? `• RCCM : ${seller.rccmNumber}` : ''}</p>` : ''}
          </div>
        </div>

        <div style="text-align: right;">
          <div style="background-color: #0f172a; color: #ffffff; padding: 8px 16px; border-radius: 8px; display: inline-block;">
            <div style="font-size: 9px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px;">REÇU OFFICIEL BÉNIN</div>
            <div style="font-size: 17px; font-weight: 900; letter-spacing: 0.5px;">${receipt.receiptNumber}</div>
          </div>
          <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b;">
            📅 Date : <strong>${formatDateFrench(receipt.createdAt)}</strong>
          </p>
        </div>
      </div>

      <!-- CLIENT BOX -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Délivré à l'attention de :</span>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px;">${receipt.clientName}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone Client :</span>
          <div style="font-size: 14px; font-weight: 700; color: #059669; margin-top: 2px;">${receipt.clientPhone || 'Client Comptant'}</div>
        </div>
      </div>

      <!-- ARTICLES TABLE -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 10px 12px; text-align: center; width: 40px; font-size: 12px; font-weight: 700;">N°</th>
            <th style="padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 700;">Désignation</th>
            <th style="padding: 10px 12px; text-align: center; width: 60px; font-size: 12px; font-weight: 700;">Qté</th>
            <th style="padding: 10px 12px; text-align: right; width: 130px; font-size: 12px; font-weight: 700;">Prix Unit.</th>
            <th style="padding: 10px 12px; text-align: right; width: 140px; font-size: 12px; font-weight: 700;">Total (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      <!-- TOTALS & STAMP ROW -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 20px;">
        <!-- OFFICIAL STAMP -->
        <div style="flex: 1; display: flex; justify-content: flex-start;">
          <div style="border: 3px solid ${stampColor}; background-color: ${stampBg}; color: ${stampColor}; border-radius: 12px; padding: 10px 18px; text-align: center; transform: rotate(-3deg); display: inline-block;">
            <div style="font-size: 9px; font-weight: 800; letter-spacing: 1px;">RÉPUBLIQUE DU BÉNIN</div>
            <div style="font-size: 20px; font-weight: 900; margin: 2px 0;">${stampTitle}</div>
            <div style="font-size: 10px; font-weight: 700;">${stampSub}</div>
          </div>
        </div>

        <!-- TOTALS BREAKDOWN -->
        <div style="width: 320px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 6px;">
            <span>Total Général :</span>
            <span style="font-weight: 800; color: #0f172a; font-size: 14px;">${formatFCFA(receipt.totalAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 8px;">
            <span>Avance payée :</span>
            <span style="font-weight: 700; color: #b45309; font-size: 13px;">${formatFCFA(receipt.advancePaid)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 900; border-top: 1px solid #cbd5e1; padding-top: 8px; color: ${receipt.balanceDue > 0 ? '#b91c1c' : '#15803d'};">
            <span>Reste à payer :</span>
            <span style="font-size: 17px;">${formatFCFA(receipt.balanceDue)}</span>
          </div>
        </div>
      </div>

      <!-- NOTES IF PRESENT -->
      ${receipt.notes ? `<div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #1e3a8a;"><strong>Note :</strong> ${receipt.notes}</div>` : ''}

      <!-- UNIQUE OFFICIAL PAYMENT METHODS (MTN & CELTIIS) -->
      <div style="background: linear-gradient(90deg, #fffbeb 0%, #f0f9ff 100%); border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 18px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 6px; letter-spacing: 0.5px;">
          💳 Règlement Mobile Money Fournisseur :
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #1e293b;">
          <div>
            🟡 <strong>MTN MoMo :</strong> <span style="font-family: monospace; font-size: 13px; font-weight: 800;">${seller.momoNumber || seller.shopPhone || 'Non configuré'}</span> (${seller.momoName || seller.shopOwner || 'Fournisseur'})
          </div>
          <div>
            🔵 <strong>Celtiis Cash :</strong> <span style="font-family: monospace; font-size: 13px; font-weight: 800;">${seller.celtiisNumber || seller.shopPhone || 'Non configuré'}</span> (${seller.celtiisName || seller.shopOwner || 'Fournisseur'})
          </div>
        </div>
      </div>

      <!-- FOOTER & CREATOR CREDIT -->
      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b;">
        <div style="font-weight: 600; font-style: italic; color: #1e293b; margin-bottom: 4px;">
          "${receipt.footerText || seller.defaultFooter || 'Merci pour votre confiance !'}"
        </div>
        <div>
          Certifié conforme • Reçu Pro Bénin • Développé par <strong>jboy Ozzy (Clovis Arsène junior DOUBOGAN)</strong>
        </div>
      </div>
    </div>
  `;

  return container;
}

/**
 * High-precision Vector PDF Generator using pure jsPDF vector primitives
 * Guarantees crisp, sharp text, borders and tables on every device without canvas artifacts.
 */
function generateVectorPDF(receipt: Receipt): boolean {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const seller = receipt.seller;
    const pageWidth = 210;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Header Stripe (Green / Amber / Red)
    pdf.setFillColor(22, 163, 74); // Green
    pdf.rect(margin, y, contentWidth / 3, 2, 'F');
    pdf.setFillColor(245, 158, 11); // Amber
    pdf.rect(margin + contentWidth / 3, y, contentWidth / 3, 2, 'F');
    pdf.setFillColor(220, 38, 38); // Red
    pdf.rect(margin + (2 * contentWidth) / 3, y, contentWidth / 3, 2, 'F');

    y += 8;

    // Shop Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42);
    pdf.text((seller.shopName || 'Boutique Commerciale').toUpperCase(), margin, y);

    // Receipt Number Badge on right
    pdf.setFillColor(15, 23, 42);
    pdf.roundedRect(pageWidth - margin - 48, y - 6, 48, 12, 2, 2, 'F');
    pdf.setTextColor(251, 191, 36);
    pdf.setFontSize(7);
    pdf.text('REÇU OFFICIEL BÉNIN', pageWidth - margin - 46, y - 2);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.text(receipt.receiptNumber, pageWidth - margin - 46, y + 3);

    y += 6;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    if (seller.shopOwner) {
      pdf.text(`Responsable : ${seller.shopOwner}`, margin, y);
      y += 5;
    }
    pdf.text(`Contact : ${seller.shopPhone || 'Non renseigné'} • ${seller.city || 'Cotonou'} (Bénin)`, margin, y);
    pdf.text(`Date : ${formatDateFrench(receipt.createdAt)}`, pageWidth - margin - 48, y);

    y += 10;

    // Client Card
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DÉLIVRÉ À L\'ATTENTION DE :', margin + 4, y + 5);
    pdf.text('CONTACT CLIENT (WHATSAPP) :', pageWidth - margin - 55, y + 5);

    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(receipt.clientName, margin + 4, y + 10);
    pdf.setTextColor(5, 150, 105);
    pdf.text(receipt.clientPhone || 'Non renseigné', pageWidth - margin - 55, y + 10);

    y += 18;

    // Table Header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(margin, y, contentWidth, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('N°', margin + 3, y + 5.5);
    pdf.text('Désignation', margin + 14, y + 5.5);
    pdf.text('Qté', margin + 110, y + 5.5, { align: 'center' });
    pdf.text('Prix Unit.', margin + 142, y + 5.5, { align: 'right' });
    pdf.text('Total (FCFA)', pageWidth - margin - 4, y + 5.5, { align: 'right' });

    y += 8;

    // Table Rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    receipt.items.forEach((item, index) => {
      const rowBg = index % 2 === 0 ? 255 : 248;
      pdf.setFillColor(rowBg, rowBg, rowBg);
      pdf.rect(margin, y, contentWidth, 8, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y + 8, pageWidth - margin, y + 8);

      pdf.setTextColor(100, 116, 139);
      pdf.text(String(index + 1), margin + 3, y + 5.5);

      pdf.setTextColor(15, 23, 42);
      pdf.text(item.name.substring(0, 48), margin + 14, y + 5.5);

      pdf.text(String(item.quantity), margin + 110, y + 5.5, { align: 'center' });
      pdf.text(formatFCFA(item.unitPrice), margin + 142, y + 5.5, { align: 'right' });

      pdf.setFont('helvetica', 'bold');
      pdf.text(formatFCFA(item.total), pageWidth - margin - 4, y + 5.5, { align: 'right' });
      pdf.setFont('helvetica', 'normal');

      y += 8;
    });

    y += 6;

    // Stamp and Totals Box
    const stampText =
      receipt.status === 'PAID'
        ? '★ FACTURE PAYÉE ★'
        : receipt.status === 'PARTIAL'
        ? '★ ACOMPTE VERSÉ ★'
        : '★ IMPAYÉ ★';

    // Draw Stamp on left
    if (receipt.status === 'PAID') {
      pdf.setDrawColor(22, 163, 74);
      pdf.setFillColor(240, 253, 244);
      pdf.setTextColor(22, 163, 74);
    } else if (receipt.status === 'PARTIAL') {
      pdf.setDrawColor(217, 119, 6);
      pdf.setFillColor(255, 251, 235);
      pdf.setTextColor(217, 119, 6);
    } else {
      pdf.setDrawColor(220, 38, 38);
      pdf.setFillColor(254, 242, 242);
      pdf.setTextColor(220, 38, 38);
    }
    pdf.roundedRect(margin, y, 65, 22, 2, 2, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('RÉPUBLIQUE DU BÉNIN', margin + 32.5, y + 6, { align: 'center' });
    pdf.setFontSize(11);
    pdf.text(stampText, margin + 32.5, y + 13, { align: 'center' });
    pdf.setFontSize(7.5);
    pdf.text(
      receipt.status === 'PAID'
        ? 'SOLDÉ'
        : receipt.status === 'PARTIAL'
        ? `Reste: ${formatFCFA(receipt.balanceDue)}`
        : 'EN ATTENTE DE RÈGLEMENT',
      margin + 32.5,
      y + 18,
      { align: 'center' }
    );

    // Totals Box on Right
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(pageWidth - margin - 75, y, 75, 24, 2, 2, 'FD');

    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Total Général :', pageWidth - margin - 71, y + 6);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(formatFCFA(receipt.totalAmount), pageWidth - margin - 4, y + 6, { align: 'right' });

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('Avance reçue :', pageWidth - margin - 71, y + 12);
    pdf.setTextColor(180, 83, 9);
    pdf.text(formatFCFA(receipt.advancePaid), pageWidth - margin - 4, y + 12, { align: 'right' });

    pdf.setDrawColor(203, 213, 225);
    pdf.line(pageWidth - margin - 71, y + 15, pageWidth - margin - 4, y + 15);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(receipt.balanceDue > 0 ? 185 : 21, receipt.balanceDue > 0 ? 28 : 128, receipt.balanceDue > 0 ? 28 : 61);
    pdf.text('Reste à payer :', pageWidth - margin - 71, y + 20);
    pdf.text(formatFCFA(receipt.balanceDue), pageWidth - margin - 4, y + 20, { align: 'right' });

    y += 28;

    // Mobile Money Section (Strictly MTN & Celtiis)
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('RÈGLEMENT DIRECT FOURNISSEUR (MOBILE MONEY) :', margin + 4, y + 5);

    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 41, 59);
    const momoTxt = `MTN MoMo : ${seller.momoNumber || seller.shopPhone || 'Non configuré'} (${seller.momoName || seller.shopOwner || 'Fournisseur'})`;
    const celtiisTxt = `Celtiis Cash : ${seller.celtiisNumber || seller.shopPhone || 'Non configuré'} (${seller.celtiisName || seller.shopOwner || 'Fournisseur'})`;
    pdf.text(momoTxt, margin + 4, y + 10);
    pdf.text(celtiisTxt, margin + 95, y + 10);

    y += 18;

    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 116, 139);
    pdf.text(`"${receipt.footerText || seller.defaultFooter || 'Merci pour votre confiance !'}"`, pageWidth / 2, y, { align: 'center' });
    y += 4;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text('Reçu Pro Bénin • Développé par jboy Ozzy (Clovis Arsène junior DOUBOGAN)', pageWidth / 2, y, { align: 'center' });

    const cleanClient = receipt.clientName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${receipt.receiptNumber}_${cleanClient || 'Client'}.pdf`;
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Vector PDF generation error:', err);
    return false;
  }
}

/**
 * Main export function:
 * 1. Generates an offscreen 794px A4 node and captures it at 2x scale for high-definition visual fidelity.
 * 2. If canvas generation encounters any issue, falls back to direct vector jsPDF generation.
 */
export async function exportReceiptToPDF(
  _elementId: string,
  receipt: Receipt,
  onProgress?: (status: string) => void
): Promise<boolean> {
  let offscreenNode: HTMLElement | null = null;
  try {
    if (onProgress) onProgress('Préparation du document haute résolution...');

    offscreenNode = createPrintableDOMNode(receipt);
    document.body.appendChild(offscreenNode);

    // Allow browser to calculate styles and layout
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (onProgress) onProgress('Rendu graphique A4...');

    const canvas = await html2canvas(offscreenNode, {
      scale: 2.0, // High-DPI 300dpi feel
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    });

    if (onProgress) onProgress('Génération du fichier PDF...');

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;
    const printableWidth = pdfWidth - margin * 2;

    const imgProps = pdf.getImageProperties(imgData);
    const contentHeight = (imgProps.height * printableWidth) / imgProps.width;

    if (contentHeight <= pdfHeight - margin * 2) {
      pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, contentHeight);
    } else {
      let position = margin;
      let heightLeft = contentHeight;

      pdf.addImage(imgData, 'PNG', margin, position, printableWidth, contentHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - contentHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, printableWidth, contentHeight);
        heightLeft -= pdfHeight;
      }
    }

    const cleanClient = receipt.clientName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${receipt.receiptNumber}_${cleanClient || 'Client'}.pdf`;

    pdf.save(filename);

    if (onProgress) onProgress('Téléchargement terminé !');
    return true;
  } catch (err) {
    console.warn('Canvas export failed, falling back to direct vector jsPDF:', err);
    if (onProgress) onProgress('Génération PDF vectorielle de secours...');
    const vectorSuccess = generateVectorPDF(receipt);
    if (onProgress) onProgress(vectorSuccess ? 'Téléchargement terminé !' : 'Erreur');
    return vectorSuccess;
  } finally {
    if (offscreenNode && document.body.contains(offscreenNode)) {
      document.body.removeChild(offscreenNode);
    }
  }
}

export function printReceipt(): void {
  window.print();
}
