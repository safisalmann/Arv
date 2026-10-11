import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfGenerationProgress {
  status: 'idle' | 'rendering' | 'generating' | 'completed' | 'error';
  progress: number;
  message: string;
}

export async function generateAndDownloadPdf(
  elementId: string,
  filename: string = 'A-Z_Vocabulary_Dictionary_Bangla.pdf',
  onProgress?: (progress: PdfGenerationProgress) => void
): Promise<void> {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  try {
    onProgress?.({
      status: 'rendering',
      progress: 15,
      message: 'Preparing document layout for PDF rendering...',
    });

    // Make element temporarily visible if hidden
    const originalDisplay = targetElement.style.display;
    targetElement.style.display = 'block';

    onProgress?.({
      status: 'rendering',
      progress: 35,
      message: 'Capturing high-resolution Bengali typography...',
    });

    // Render using html2canvas with scale 2 for crisp vector-like text
    const canvas = await html2canvas(targetElement, {
      scale: 1.8,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    onProgress?.({
      status: 'generating',
      progress: 70,
      message: 'Compiling multi-page PDF structure...',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    let pageNum = 1;
    while (heightLeft > 0) {
      position = -(pageHeight * pageNum);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageNum++;
    }

    // Restore original display
    targetElement.style.display = originalDisplay;

    onProgress?.({
      status: 'generating',
      progress: 95,
      message: 'Finalizing PDF download file...',
    });

    pdf.save(filename);

    onProgress?.({
      status: 'completed',
      progress: 100,
      message: 'PDF successfully generated and saved!',
    });
  } catch (err: any) {
    console.error('PDF generation error:', err);
    onProgress?.({
      status: 'error',
      progress: 0,
      message: err?.message || 'Failed to generate PDF. You can also use the Native Print option.',
    });
    throw err;
  }
}

export function triggerBrowserPrint(): void {
  window.print();
}
