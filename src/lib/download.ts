import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

// Helper to fetch the logo as base64 at runtime
async function getLogoBase64(): Promise<string | null> {
    try {
        const response = await fetch('/assets/kc-logo.png');
        if (!response.ok) return null;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Failed to fetch logo:", e);
        return null;
    }
}

// Helper to consolidate logo injection for Care Label
async function getFinalSvgContent(svgContent: string, templateId?: string): Promise<string> {
    let finalSvgContent = svgContent;
    if (templateId === 'care_label_30x73') {
        const logoData = await getLogoBase64();
        if (logoData) {
            const x = 242; 
            const y = 471; 
            const logoTag = `<image x="${x}" y="${y}" width="25" height="33" href="${logoData}"/>`;
            finalSvgContent = finalSvgContent.replace('</g>', `${logoTag}\n  </g>`);
        }
    }
    return finalSvgContent;
}

// Helper to render SVG to a high-resolution PNG Data URL
async function svgToDataUrl(svgContent: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const svg = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svg);
        const img = new Image();
        
        img.onload = () => {
            const scale = 4; // High Quality Scale
            const canvas = document.createElement('canvas');
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                resolve(dataUrl);
            } else {
                reject(new Error("Failed to get canvas context"));
            }
        };
        
        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
        
        img.src = url;
    });
}

export async function downloadSvg(svgContent: string, fileName: string) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, `${fileName}.svg`);
}

export async function downloadPng(svgContent: string, fileName: string, templateId?: string) {
    const finalSvgContent = await getFinalSvgContent(svgContent, templateId);
    const dataUrl = await svgToDataUrl(finalSvgContent);
    
    // Convert Data URL back to Blob for file-saver
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    saveAs(blob, `${fileName}.png`);
}

export async function downloadPdf(svgContent: string, fileName: string, templateId?: string) {
    const finalSvgContent = await getFinalSvgContent(svgContent, templateId);
    
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(finalSvgContent, 'image/svg+xml');
    const element = svgDoc.documentElement as unknown as SVGSVGElement;

    const width = parseFloat(element.getAttribute('width') || '0');
    const height = parseFloat(element.getAttribute('height') || '0');
    
    const widthPts = width * 2.83465; // mm to points
    const heightPts = height * 2.83465;

    const pdf = new jsPDF({
        orientation: width > height ? 'l' : 'p',
        unit: 'pt',
        format: [widthPts, heightPts],
        compress: true // Reduce file size
    });

    const dataUrl = await svgToDataUrl(finalSvgContent);
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthPts, heightPts, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);
}

export async function downloadZip(files: { name: string; content: string }[], zipName: string) {
    const zip = new JSZip();
    files.forEach(file => {
        zip.file(`${file.name}.svg`, file.content);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${zipName}.zip`);
}

export async function downloadMultiPagePdf(
    files: { size: string; content: string }[],
    pdfName: string,
    widthMm: number = 80,
    heightMm: number = 40
) {
    const widthPts = widthMm * 2.83465;
    const heightPts = heightMm * 2.83465;

    const pdf = new jsPDF({
        orientation: widthMm > heightMm ? 'l' : 'p',
        unit: 'pt',
        format: [widthPts, heightPts],
        compress: true
    });

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (i > 0) pdf.addPage([widthPts, heightPts], widthMm > heightMm ? 'l' : 'p');

        // Note: Batch mode uses the design content Directly. 
        // Logic for logo injection is assumed to be handled by the caller or needed here.
        // For safety, we process the content here if it's the care label.
        const templateId = widthMm === 30 && heightMm === 73 ? 'care_label_30x73' : undefined;
        const finalSvgContent = await getFinalSvgContent(file.content, templateId);
        
        const dataUrl = await svgToDataUrl(finalSvgContent);
        pdf.addImage(dataUrl, 'PNG', 0, 0, widthPts, heightPts, undefined, 'FAST');
    }

    pdf.save(`${pdfName}.pdf`);
}

