import { PDFDocument } from "pdf-lib";

export async function mergePdfs(pdfBuffers: Uint8Array[] | ArrayBuffer[]) {
  // Create a new PDF to hold everything
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    // Load each existing PDF
    const pdf = await PDFDocument.load(buffer);

    // Copy all pages from it
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

    // Add them to the merged document
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Save merged PDF
  return await mergedPdf.save();
}
