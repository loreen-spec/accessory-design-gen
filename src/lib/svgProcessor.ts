export interface DesignData {
    styleName: string;
    sku: string;
    sizeRange: string;
    color: string;
    season: string;
    size: string;
    barcode?: string;
    productCode?: string;
    additionalText?: string;
    templateId?: string;
    // New fields for barcode label and price tag
    productName?: string;
    optionText?: string;
    barcodeText?: string;
    fullSku?: string;
    styleCode?: string;
    ageText?: string;
    materialText?: string;
    makerText?: string;
    countryText?: string;
    priceText?: string;
    addressText?: string;
    contactText?: string;
}

const C128_PATTERNS = [
    [2, 1, 2, 2, 2, 2], [2, 2, 2, 1, 2, 2], [2, 2, 2, 2, 2, 1], [1, 2, 1, 2, 2, 3], [1, 2, 1, 3, 2, 2],
    [1, 3, 1, 2, 2, 2], [1, 2, 2, 2, 1, 3], [1, 2, 2, 3, 1, 2], [1, 3, 2, 2, 1, 2], [2, 2, 1, 2, 1, 3],
    [2, 2, 1, 3, 1, 2], [2, 3, 1, 2, 1, 2], [1, 1, 2, 2, 3, 2], [1, 2, 2, 1, 3, 2], [1, 2, 2, 2, 3, 1],
    [1, 1, 3, 2, 2, 2], [1, 2, 3, 1, 2, 2], [1, 2, 3, 2, 2, 1], [2, 2, 3, 2, 1, 1], [2, 2, 1, 1, 3, 2],
    [2, 2, 1, 2, 3, 1], [2, 1, 3, 2, 1, 2], [2, 2, 3, 1, 1, 2], [3, 1, 2, 1, 3, 1], [3, 1, 1, 2, 2, 2],
    [3, 2, 1, 1, 2, 2], [3, 2, 1, 2, 2, 1], [3, 1, 2, 2, 1, 2], [3, 2, 2, 1, 1, 2], [3, 2, 2, 2, 1, 1],
    [2, 1, 2, 1, 2, 3], [2, 1, 2, 3, 2, 1], [2, 3, 2, 1, 2, 1], [1, 1, 1, 3, 2, 3], [1, 3, 1, 1, 2, 3],
    [1, 3, 1, 3, 2, 1], [1, 1, 2, 3, 1, 3], [1, 3, 2, 1, 1, 3], [1, 3, 2, 3, 1, 1], [2, 1, 1, 3, 1, 3],
    [2, 3, 1, 1, 1, 3], [2, 3, 1, 3, 1, 1], [1, 1, 2, 1, 3, 3], [1, 1, 2, 3, 3, 1], [1, 3, 2, 1, 3, 1],
    [1, 1, 3, 1, 2, 3], [1, 1, 3, 3, 2, 1], [1, 3, 3, 1, 2, 1], [3, 1, 3, 1, 2, 1], [2, 1, 1, 3, 3, 1],
    [2, 3, 1, 1, 3, 1], [2, 1, 3, 1, 1, 3], [2, 1, 3, 3, 1, 1], [2, 1, 3, 1, 3, 1], [3, 1, 1, 1, 2, 3],
    [3, 1, 1, 3, 2, 1], [3, 3, 1, 1, 2, 1], [3, 1, 2, 1, 1, 3], [3, 1, 2, 3, 1, 1], [3, 3, 2, 1, 1, 1],
    [3, 1, 4, 1, 1, 1], [2, 2, 1, 4, 1, 1], [4, 3, 1, 1, 1, 1], [1, 1, 1, 2, 2, 4], [1, 1, 1, 4, 2, 2],
    [1, 2, 1, 1, 2, 4], [1, 2, 1, 4, 2, 1], [1, 4, 1, 1, 2, 2], [1, 4, 1, 2, 2, 1], [1, 1, 2, 2, 1, 4],
    [1, 1, 2, 4, 1, 2], [1, 2, 2, 1, 1, 4], [1, 2, 2, 4, 1, 1], [1, 4, 2, 1, 1, 2], [1, 4, 2, 2, 1, 1],
    [2, 4, 1, 2, 1, 1], [2, 2, 1, 1, 1, 4], [4, 1, 3, 1, 1, 1], [2, 4, 1, 1, 1, 2], [1, 3, 4, 1, 1, 1],
    [1, 1, 1, 2, 4, 2], [1, 2, 1, 1, 4, 2], [1, 2, 1, 2, 4, 1], [1, 1, 4, 2, 1, 2], [1, 2, 4, 1, 1, 2],
    [1, 2, 4, 2, 1, 1], [4, 1, 1, 2, 1, 2], [4, 2, 1, 1, 1, 2], [4, 2, 1, 2, 1, 1], [2, 1, 2, 1, 4, 1],
    [2, 1, 4, 1, 2, 1], [4, 1, 2, 1, 2, 1], [1, 1, 1, 1, 4, 3], [1, 1, 1, 3, 4, 1], [1, 3, 1, 1, 4, 1],
    [1, 1, 4, 1, 1, 3], [1, 1, 4, 3, 1, 1], [4, 1, 1, 1, 1, 3], [4, 1, 1, 3, 1, 1], [1, 1, 3, 1, 4, 1],
    [1, 1, 4, 1, 3, 1], [3, 1, 1, 1, 4, 1], [4, 1, 1, 1, 3, 1], [2, 1, 1, 4, 1, 2], [2, 1, 1, 2, 1, 4],
    [2, 1, 1, 2, 3, 2], [2, 3, 3, 1, 1, 1, 2]
];

function generateBarcodeSvg(text: string, targetWidth: number, targetHeight: number): string {
    const safeText = (text || "").substring(0, 24);
    let checksum = 104; // START_B
    const indices: number[] = [104];
    
    for (let i = 0; i < safeText.length; i++) {
        const val = safeText.charCodeAt(i) - 32;
        if (val >= 0 && val <= 102) {
            indices.push(val);
            checksum += val * (i + 1);
        }
    }
    
    indices.push(checksum % 103);
    indices.push(106); // STOP
    
    let x = 0;
    let rects = "";
    const totalModules = (indices.length - 1) * 11 + 13;
    const moduleWidth = targetWidth / totalModules;
    
    for (const index of indices) {
        const pattern = C128_PATTERNS[index];
        if (!pattern) continue;
        for (let i = 0; i < pattern.length; i++) {
            const width = pattern[i] * moduleWidth;
            if (i % 2 === 0) { // Bar
                rects += `<rect x="${x.toFixed(2)}" y="0" width="${width.toFixed(2)}" height="${targetHeight}" fill="black" />`;
            }
            x += width;
        }
    }
    
    return rects;
}

/**
 * Processes the SVG template by replacing text within elements matching specific IDs.
 * Includes basic logic for font-size adjustment if text is too long.
 */
export function processSvgTemplate(template: string, data: DesignData): string {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(template, "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) return template;

    // Automated Barcode Generation for templates
    if (data.templateId === 'barcode_80x40' || template.includes('id="barcode_target"')) {
        const barcodeContent = generateBarcodeSvg(data.fullSku || data.sku || "", 42, 9);
        const target = svgDoc.getElementById('barcode_target');
        if (target) target.innerHTML = barcodeContent;
    } 
    
    if (data.templateId === 'price_tag_40x80') {
        const barcodeVal = data.barcodeText || data.sku || "";
        const topTarget = svgDoc.getElementById('barcode_target_top');
        const bottomTarget = svgDoc.getElementById('barcode_target_bottom');
        if (topTarget) topTarget.innerHTML = generateBarcodeSvg(barcodeVal, 320, 60);
        if (bottomTarget) bottomTarget.innerHTML = generateBarcodeSvg(barcodeVal, 320, 60);
    }

    const replaceMap: Record<string, string> = {
        styleName: data.styleName,
        sku: data.sku,
        color: data.sizeRange,
        season: data.season,
        size: data.size,
        additionalText: data.additionalText || "",
        // Map common fields - Prioritize styleName (Style/Product Name field) for product names
        productName: data.styleName || data.productName || "",
        optionText: data.optionText || `${data.color}, ${data.size}`,
        barcodeText: data.barcodeText || data.sku,
        // Specific ID mappings for Price Tag 40x80
        value_productName_top: data.styleName || data.productName || "",
        value_styleCode_top: data.sku || data.productCode || data.styleCode || "",
        value_option_top: data.optionText || `${data.color}, ${data.size}`,
        value_age_top: data.ageText || "",
        value_material_top: data.materialText || "",
        value_maker_top: data.makerText || "",
        value_country_top: data.countryText || "",
        value_price_top: data.priceText || "",
        value_barcode_top: data.barcodeText || data.sku,

        value_barcode_bottom: data.barcodeText || data.sku,
        value_productName_bottom: data.styleName || "",
        value_option_bottom: data.optionText || `${data.color}, ${data.size}`,
        value_price_bottom: data.priceText || "",

        // Values for templates with separate label/value IDs
        productNameValue: data.styleName || data.productName || "",
        skuValue: data.sku || data.productCode || "",
        value_sku: data.sku || data.productCode || "",
        optionValue: data.optionText || `${data.color}, ${data.size}`,
        value_fullSku: data.fullSku || "",

        // Care Label specific mappings
        value_option_care: data.optionText || `${data.color}, ${data.size}`,
        value_sku_care: data.fullSku || data.sku || data.productCode || "",
        value_productName_care: data.styleName || data.productName || "",
        value_age_care: data.ageText || "",
        value_material_care: (data.materialText || "").split('\n')[0] || "",
        value_material2_care: (data.materialText || "").split('\n')[1] || "",
        value_additional_care: data.additionalText || "",
        value_maker_care: data.makerText || "",
        value_country_care: data.countryText || "",
        value_address_care: (data.addressText || "").split('\n')[0] || "",
        value_address2_care: (data.addressText || "").split('\n')[1] || "",
        value_contact_care: data.contactText || "",
    };

    Object.entries(replaceMap).forEach(([id, value]) => {
        const el = svgDoc.getElementById(id);
        if (el && (el.nodeName === "text" || el.nodeName === "tspan")) {
            el.textContent = value;
            adjustFontSize(el as unknown as SVGTextElement, value);
        }
    });

    return new XMLSerializer().serializeToString(svgDoc);
}

function adjustFontSize(el: SVGTextElement, text: string) {
    const currentFontSize = parseFloat(el.getAttribute("font-size") || "20");
    const maxLength = 22; // Threshold for Price Tag strings

    if (text.length > maxLength) {
        const newSize = Math.max(10, currentFontSize * (maxLength / text.length));
        el.setAttribute("font-size", newSize.toString());
    }
}

