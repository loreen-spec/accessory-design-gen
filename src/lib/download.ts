import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { svg2pdf } from 'svg2pdf.js';

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

export async function downloadSvg(svgContent: string, fileName: string) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, `${fileName}.svg`);
}

export async function downloadPng(svgContent: string, fileName: string, templateId?: string) {
    let finalSvgContent = svgContent;

    // Dynamic logo injection for Care Label only during export
    if (templateId === 'care_label_30x73') {
        const logoData = await getLogoBase64();
        if (logoData) {
            // Updated to x=242, y=487 to match Country line baseline
            const x = 242; 
            const y = 487; 
            const logoTag = `<image x="${x}" y="${y}" width="25" height="33" href="${logoData}"/>`;
            finalSvgContent = finalSvgContent.replace('</g>', `${logoTag}\n  </g>`);
        }
    }

    const canvas = document.createElement('canvas');
    const svg = new Blob([finalSvgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svg);

    const img = new Image();
    img.onload = () => {
        // High Quality Scale (4x)
        const scale = 4;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw image scaled up
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) saveAs(blob, `${fileName}.png`);
                URL.revokeObjectURL(url);
            }, 'image/png');
        }
    };
    img.src = url;
}

export async function downloadPdf(svgContent: string, fileName: string, templateId?: string) {
    let finalSvgContent = svgContent;

    // Dynamic logo injection for Care Label only during export
    if (templateId === 'care_label_30x73') {
        const logoData = await getLogoBase64();
        if (logoData) {
            const x = 242;
            const y = 487;
            const logoTag = `<image x="${x}" y="${y}" width="25" height="33" href="${logoData}"/>`;
            finalSvgContent = finalSvgContent.replace('</g>', `${logoTag}\n  </g>`);
        }
    }

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(finalSvgContent, 'image/svg+xml');
    const element = svgDoc.documentElement as unknown as SVGSVGElement;

    const width = parseFloat(element.getAttribute('width') || '0');
    const height = parseFloat(element.getAttribute('height') || '0');
    
    const widthPts = width * 2.83465;
    const heightPts = height * 2.83465;

    const pdf = new jsPDF({
        orientation: width > height ? 'l' : 'p',
        unit: 'pt',
        format: [widthPts, heightPts]
    });

    await svg2pdf(element, pdf, {
        x: 0,
        y: 0,
        width: widthPts,
        height: heightPts
    });

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
        format: [widthPts, heightPts]
    });

    const parser = new DOMParser();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (i > 0) pdf.addPage([widthPts, heightPts], widthMm > heightMm ? 'l' : 'p');

        const svgDoc = parser.parseFromString(file.content, 'image/svg+xml');
        const element = svgDoc.documentElement as unknown as SVGSVGElement;

        await svg2pdf(element, pdf, {
            x: 0,
            y: 0,
            width: widthPts,
            height: heightPts
        });
    }

    pdf.save(`${pdfName}.pdf`);
}
