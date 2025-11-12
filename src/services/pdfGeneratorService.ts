import type { CustomizationState } from '../types/index';
import type { SignatureData } from '../components/DigitalSignature';

export class PDFGeneratorService {
  private static instance: PDFGeneratorService;

  private constructor() {}

  static getInstance(): PDFGeneratorService {
    if (!PDFGeneratorService.instance) {
      PDFGeneratorService.instance = new PDFGeneratorService();
    }
    return PDFGeneratorService.instance;
  }

  /**
   * Genera un PDF usando window.print() con CSS optimizado
   */
  async generatePDF(state: CustomizationState, signatureData?: SignatureData): Promise<void> {
    // Crear una nueva ventana con el contenido para imprimir
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
    }

    const htmlContent = this.generatePrintableHTML(state, signatureData);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Esperar a que se carguen los estilos
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    };
  }

  /**
   * Genera HTML optimizado para impresión/PDF
   */
  private generatePrintableHTML(state: CustomizationState, signatureData?: SignatureData): string {
    const summaryData = this.generateSummaryData(state);
    const timestamp = new Date().toLocaleString('es-MX');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personalización de Vivienda - Cumbres León</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #012D58;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .container {
            max-width: 100%;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 30px 20px;
            background: linear-gradient(135deg, #012D58, #02ACF2);
            color: white;
            border-radius: 10px;
        }
        
        .logo {
            font-size: 3rem;
            margin-bottom: 15px;
        }
        
        .title {
            font-size: 2.2rem;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            text-align: center;
            padding: 20px;
            background: #E6F4FC;
            border-radius: 10px;
            border: 2px solid #02ACF2;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #02ACF2;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 1rem;
            color: #012D58;
            font-weight: 600;
        }
        
        .section {
            margin: 25px 0;
            page-break-inside: avoid;
        }
        
        .section-header {
            background: linear-gradient(135deg, #f8fafc, #e6f4fc);
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 5px solid #02ACF2;
            margin-bottom: 15px;
        }
        
        .section-title {
            font-size: 1.4rem;
            color: #012D58;
            font-weight: bold;
        }
        
        .model-section .section-header {
            background: linear-gradient(135deg, #e6f4fc, #cce9f9);
            border-left-color: #012D58;
        }
        
        .items-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            background: #fafbfc;
            padding: 20px;
            border-radius: 8px;
        }
        
        .item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .item-label {
            font-weight: 600;
            color: #64748b;
            flex: 1;
        }
        
        .item-value {
            font-weight: 700;
            color: #012D58;
            text-align: right;
            flex: 1;
        }
        
        .model-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            background: #fafbfc;
            padding: 20px;
            border-radius: 8px;
        }
        
        .model-detail {
            text-align: center;
        }
        
        .model-detail-label {
            font-weight: 600;
            color: #64748b;
            margin-bottom: 8px;
        }
        
        .model-detail-value {
            font-weight: 700;
            color: #012D58;
            font-size: 1.1rem;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        /* Asegurar que las secciones no se corten */
        .section {
            break-inside: avoid;
        }
        
        /* Mejorar la calidad de impresión */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .header, .stat-card, .section-header {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🏠</div>
            <h1 class="title">Personalización de Vivienda</h1>
            <p class="subtitle">Cumbres León - Proyecto Personalizado</p>
        </div>

        <!-- Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${summaryData.totalSelections}</div>
                <div class="stat-label">Selecciones Realizadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summaryData.completionPercentage}%</div>
                <div class="stat-label">Completado</div>
            </div>
        </div>

        ${state.selectedModel ? `
        <!-- Model Section -->
        <div class="section model-section">
            <div class="section-header">
                <h2 class="section-title">🏡 Modelo de Casa</h2>
            </div>
            <div class="model-info">
                <div class="model-detail">
                    <div class="model-detail-label">Modelo Seleccionado</div>
                    <div class="model-detail-value">${state.selectedModel.name}</div>
                </div>
                <div class="model-detail">
                    <div class="model-detail-label">Descripción</div>
                    <div class="model-detail-value">${state.selectedModel.description}</div>
                </div>
            </div>
        </div>
        ` : ''}

        ${this.generateSectionHTML('🎨 Interiores', state.interiores, {
          sala: 'Sala',
          comedor: 'Comedor',
          recamara1: 'Recámara Principal',
          recamara2: 'Recámara 2',
          recamara3: 'Recámara 3',
          escaleras: 'Escaleras'
        })}

        ${this.generateSectionHTML('🍳 Cocina', state.cocina, {
          alacenaSuperior: 'Alacena Superior',
          alacenaInferior: 'Alacena Inferior',
          alacenaBarraL: 'Alacena Barra L',
          alacenaExtra: 'Alacena Extra',
          cubierta: 'Cubierta',
          backsplash: 'Backsplash',
          tarja: 'Tarja'
        })}

        ${this.generateSectionHTML('🚿 Baños', state.banos, {
          muebleBanoA: 'Mueble Baño A',
          muebleBanoB: 'Mueble Baño B',
          muebleBanoC: 'Mueble Baño C',
          colorMueble: 'Color de Mueble',
          acabadoCanceles: 'Acabado Canceles'
        })}

        ${this.generateSectionHTML('👔 Closets', state.closets, {
          recamara1: 'Closet Recámara 1',
          recamara2: 'Closet Recámara 2',
          recamara3: 'Closet Recámara 3',
          muebleBajoEscalera: 'Mueble Bajo Escalera',
          puertasMarcoEscalera: 'Puertas Marco Escalera'
        })}

        ${this.generateExtrasHTML(state)}

        ${this.generateDynamicSelectionsHTML(state)}

        ${signatureData ? this.generateSignatureHTML(signatureData) : ''}

        <!-- Footer -->
        <div class="footer">
            <p><strong>Documento generado el ${timestamp}</strong></p>
            <p>Sistema de Personalización Cumbres León © 2024</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Genera HTML para una sección específica
   */
  private generateSectionHTML(title: string, section: Record<string, unknown>, labels: Record<string, string>): string {
    const items = Object.entries(section)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => {
        const option = value as { name: string };
        return `
          <div class="item">
            <span class="item-label">${labels[key] || key}:</span>
            <span class="item-value">${option.name}</span>
          </div>
        `;
      }).join('');

    if (items) {
      return `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">${title}</h2>
            </div>
            <div class="items-grid">
                ${items}
            </div>
        </div>
      `;
    }
    return '';
  }

  /**
   * Genera HTML para la sección de extras
   */
  private generateExtrasHTML(state: CustomizationState): string {
    const extras = [];

    if (state.extras.colorFachada) {
      extras.push({ label: 'Color de Fachada', value: state.extras.colorFachada.name });
    }
    if (state.extras.minisplit) {
      extras.push({ label: 'Minisplit', value: state.extras.minisplit.name });
    }
    if (state.extras.paneles) {
      extras.push({ label: 'Paneles', value: state.extras.paneles.name });
    }
    if (state.extras.patio.estilo) {
      extras.push({ label: 'Estilo de Patio', value: state.extras.patio.estilo.name });
    }
    if (state.extras.patio.domo) {
      extras.push({ label: 'Domo', value: state.extras.patio.domo.name });
    }

    if (extras.length === 0) return '';

    const itemsHTML = extras.map(extra => `
      <div class="item">
        <span class="item-label">${extra.label}:</span>
        <span class="item-value">${extra.value}</span>
      </div>
    `).join('');

    return `
      <div class="section">
          <div class="section-header">
              <h2 class="section-title">✨ Extras y Accesorios</h2>
          </div>
          <div class="items-grid">
              ${itemsHTML}
          </div>
      </div>
    `;
  }

  /**
   * Genera HTML para selecciones dinámicas
   */
  private generateDynamicSelectionsHTML(state: CustomizationState): string {
    if (!state.dynamicSelections) return '';

    const categoryIcons: Record<string, string> = {
      interiores: '🎨',
      cocina: '🍳',
      banos: '🚿',
      closets: '💼',
      extras: '✨',
    };

    let sectionsHTML = '';

    Object.entries(state.dynamicSelections).forEach(([categoryId, categorySelections]) => {
      const hasSelections = Object.values(categorySelections).some(subcategorySelections =>
        Object.values(subcategorySelections).some(selection => selection !== null)
      );

      if (!hasSelections) return;

      // Formatear nombre de categoría
      const categoryName = categoryId
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Recolectar todos los items de esta categoría
      const items: Array<{ label: string; value: string }> = [];
      Object.entries(categorySelections).forEach(([subcategoryId, subcategorySelections]) => {
        Object.entries(subcategorySelections).forEach(([areaId, selection]) => {
          if (selection) {
            const subcategoryName = subcategoryId
              .split(/[-_]/)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            const areaName = areaId
              .split(/[-_]/)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            items.push({
              label: `${subcategoryName} - ${areaName}`,
              value: selection.name
            });
          }
        });
      });

      if (items.length > 0) {
        const itemsHTML = items.map(item => `
          <div class="item">
            <span class="item-label">${item.label}:</span>
            <span class="item-value">${item.value}</span>
          </div>
        `).join('');

        const icon = categoryIcons[categoryId] || '📦';

        sectionsHTML += `
          <div class="section">
              <div class="section-header">
                  <h2 class="section-title">${icon} ${categoryName}</h2>
              </div>
              <div class="items-grid">
                  ${itemsHTML}
              </div>
          </div>
        `;
      }
    });

    return sectionsHTML;
  }

  /**
   * Genera datos de resumen estadístico
   */
  private generateSummaryData(state: CustomizationState) {
    let totalPossibleSelections = 1; // modelo
    let completedSelections = 0;

    if (state.selectedModel) completedSelections++;

    // Contar interiores
    const interiorKeys = Object.keys(state.interiores);
    totalPossibleSelections += interiorKeys.length;
    completedSelections += Object.values(state.interiores).filter(Boolean).length;

    // Contar cocina
    const kitchenKeys = Object.keys(state.cocina);
    totalPossibleSelections += kitchenKeys.length;
    completedSelections += Object.values(state.cocina).filter(Boolean).length;

    // Contar baños
    const bathroomKeys = Object.keys(state.banos);
    totalPossibleSelections += bathroomKeys.length;
    completedSelections += Object.values(state.banos).filter(Boolean).length;

    // Contar closets
    const closetKeys = Object.keys(state.closets);
    totalPossibleSelections += closetKeys.length;
    completedSelections += Object.values(state.closets).filter(Boolean).length;

    // Contar extras
    if (state.extras.colorFachada) completedSelections++;
    if (state.extras.minisplit) completedSelections++;
    if (state.extras.paneles) completedSelections++;
    if (state.extras.patio.estilo) completedSelections++;
    if (state.extras.patio.domo) completedSelections++;
    totalPossibleSelections += 5; // extras básicos

    // Contar selecciones dinámicas
    if (state.dynamicSelections) {
      Object.values(state.dynamicSelections).forEach(categorySelections => {
        Object.values(categorySelections).forEach(subcategorySelections => {
          Object.values(subcategorySelections).forEach(areaSelection => {
            totalPossibleSelections++;
            if (areaSelection) completedSelections++;
          });
        });
      });
    }

    const completionPercentage = Math.round((completedSelections / totalPossibleSelections) * 100);

    return {
      totalPossibleSelections,
      completedSelections,
      totalSelections: completedSelections,
      completionPercentage
    };
  }

  /**
   * Genera HTML para la sección de firma
   */
  private generateSignatureHTML(signatureData: SignatureData): string {
    const signatureTimestamp = new Date(signatureData.timestamp).toLocaleString('es-MX');
    
    return `
      <div class="section" style="page-break-before: avoid; margin-top: 30px;">
          <div class="section-header" style="background: linear-gradient(135deg, #e6f4fc, #cce9f9); border-left-color: #012D58;">
              <h2 class="section-title">✍️ Firma de Conformidad</h2>
          </div>
          <div style="background: #fafbfc; padding: 25px; border-radius: 8px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                  <div>
                      <div style="font-weight: 600; color: #64748b; margin-bottom: 5px;">Nombre del Cliente:</div>
                      <div style="font-weight: 700; color: #012D58; font-size: 1.1rem;">${signatureData.name}</div>
                  </div>
                  <div>
                      <div style="font-weight: 600; color: #64748b; margin-bottom: 5px;">Correo Electrónico:</div>
                      <div style="font-weight: 700; color: #012D58; font-size: 1.1rem;">${signatureData.email}</div>
                  </div>
              </div>
              
              <div style="margin-bottom: 20px;">
                  <div style="font-weight: 600; color: #64748b; margin-bottom: 10px;">Firma:</div>
                  <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; background: white; min-height: 80px; display: flex; align-items: center;">
                      ${signatureData.type === 'canvas' 
                        ? `<img src="${signatureData.signature}" style="max-width: 200px; max-height: 60px;" alt="Firma digital" />`
                        : `<div style="font-family: cursive; font-size: 1.8rem; color: #012D58;">${signatureData.signature}</div>`
                      }
                  </div>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 0.9rem; color: #64748b;">
                  <p><strong>Fecha y hora de firma:</strong> ${signatureTimestamp}</p>
                  <p style="margin-top: 10px; font-style: italic;">
                      "Confirmo que he revisado todas las especificaciones de personalización de mi vivienda 
                      y estoy conforme con las selecciones realizadas. Entiendo que estos elementos serán 
                      la base para la construcción y/o personalización de mi hogar."
                  </p>
              </div>
          </div>
      </div>
    `;
  }
}

export const pdfGeneratorService = PDFGeneratorService.getInstance();