"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { DesignForm, DesignFormData } from '@/components/DesignForm';
import { DesignCard } from '@/components/DesignCard';
import { TEMPLATES, TemplateId } from '@/lib/constants';
import { processSvgTemplate } from '@/lib/svgProcessor';
import { calculateAge } from '@/lib/utils';
import { downloadSvg, downloadPng, downloadPdf, downloadZip, downloadMultiPagePdf } from '@/lib/download';
import { Layers, Download, Package, CheckCircle2, FileText } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState<DesignFormData>({
    templateId: 'barcode_80x40' as TemplateId,
    styleName: "아동용 가죽 자켓 H0609",
    productCode: "H0609",
    sizeRange: "90-140",
    color: "BLACK",
    season: "26 AW",
    selectedSizes: ["90", "100", "110", "120", "130", "140"],
    barcode: "6103683254580",
    productName: "아동용 가죽 자켓 H0609",
    optionText: "",
    barcodeText: "6103683254580",
    baseSku: "6103683254580",
    styleCode: "H0609",
    ageText: "2-10 years",
    materialText: "PU Leather",
    makerText: "(주)오픈한",
    countryText: "중  국",
    priceText: "¥ 49.00",
    addressText: "경기도 남양주시 진접읍\n경복대로 바람골길 42-36",
    contactText: "070-5014-2222",
    additionalText: "* 진한 색상 단독 세탁 요망",
  });

  const [templateContent, setTemplateContent] = useState<string>("");
  const [generatedDesigns, setGeneratedDesigns] = useState<{ size: string; content: string }[]>([]);

  const selectedTemplate = useMemo(() =>
    TEMPLATES.find(t => t.id === formData.templateId) || TEMPLATES[0]
    , [formData.templateId]);

  // Load template from path
  useEffect(() => {
    fetch(selectedTemplate.path)
      .then(res => res.text())
      .then(text => setTemplateContent(text))
      .catch(err => console.error("Template load error:", err));
  }, [selectedTemplate.path]);

  useEffect(() => {
    if (!templateContent) return;

    const generateSku = (base: string | undefined, currentSize: string) => {
      if (!base || base.trim() === '') return null;
      return `${base}${currentSize}`;
    };

    const designs = formData.selectedSizes.map(size => {
      const autoSku = generateSku(formData.baseSku, size);
      
      // 상단 품번 (고정)
      const topSku = `${formData.productCode}${formData.sizeRange ? ` / ${formData.sizeRange}` : ''}`;
      
      // 바코드 품번 (사이즈별 동적 반영)
      const finalBarcodeText = autoSku || formData.barcodeText || formData.barcode;

      // Auto-generate age for price_tag and care_label
      let finalAgeText = formData.ageText;
      if (formData.templateId === 'price_tag_40x80' || formData.templateId === 'care_label_30x73') {
        finalAgeText = calculateAge(size, formData.sizeRange);
      }

      // Auto-generate optionText for price_tag if empty
      let finalOptionText = formData.optionText;
      if (formData.templateId === 'price_tag_40x80' && !finalOptionText) {
        finalOptionText = `${formData.color}, ${size}`;
      }

      return {
        size,
        content: processSvgTemplate(templateContent, {
          ...formData,
          sku: topSku,     // Fixed for all sizes via productCode
          size: size,
          fullSku: autoSku || '',  // If template accesses {fullSku}
          ageText: finalAgeText,   // Auto-generated per size for Price Tag and Care Label
          optionText: finalOptionText || `${formData.color}, ${size}`,
          barcodeText: finalBarcodeText // dynamic per size via baseSku
        })
      };
    });
    setGeneratedDesigns(designs);
  }, [formData, templateContent]);

  const handleBatchDownload = async (format: 'svg' | 'zip') => {
    if (generatedDesigns.length === 0) return;

    if (format === 'zip') {
      const files = generatedDesigns.map(d => ({
        name: `${formData.styleName}_${d.size}`,
        content: d.content
      }));
      await downloadZip(files, `${formData.styleName}_All_Sizes`);
    } else {
      // Logic for batch SVG could just be the same ZIP or sequential. 
      // User asked for ZIP download separately.
    }
  };

  const handleAllPdfDownload = async () => {
    if (generatedDesigns.length === 0) return;

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:T]/g, '_').split('.')[0].replace(/-/g, '').slice(0, 13);
    const fileName = `labels_all_${formData.templateId}_${timestamp}`;

    const isPortrait = selectedTemplate.aspectRatio === '1/2';
    const width = isPortrait ? 40 : 80;
    const height = isPortrait ? 80 : 40;

    await downloadMultiPagePdf(
      generatedDesigns,
      fileName,
      width,
      height
    );
  };

  return (
    <main className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Control Panel */}
      <aside className="w-[400px] glass-panel fixed h-screen z-10 flex flex-col shadow-xl">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Layers size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Create <span className="text-indigo-600">Label</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">부자재 도안 자동 생성 시스템</p>
        </div>

        <div className="flex-1 overflow-hidden p-8">
          <DesignForm data={formData} onChange={setFormData} />
        </div>

        <div className="p-8 bg-white/50 border-t border-slate-100">
          <button
            onClick={() => handleBatchDownload('zip')}
            disabled={generatedDesigns.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <Download size={20} />
            전체 ZIP 다운로드 ({generatedDesigns.length})
          </button>
        </div>
      </aside>

      {/* Main Content - Preview Area */}
      <section className="flex-1 ml-[400px] p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">도안 미리보기</h2>
              <div className="flex items-center gap-4">
                <p className="text-slate-500 font-medium">선택한 사이즈별로 도안이 실시간으로 생성됩니다.</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                  <CheckCircle2 size={14} />
                  <span>실시간 동기화 중</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAllPdfDownload}
              disabled={generatedDesigns.length === 0}
              className="group flex items-center gap-3 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:border-slate-200 disabled:text-slate-300 disabled:bg-slate-50 rounded-2xl font-bold transition-all shadow-sm"
            >
              <FileText size={20} className="group-hover:scale-110 transition-transform" />
              <span>전체 PDF(한 파일) 다운로드</span>
            </button>
          </header>

          {generatedDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generatedDesigns.map((design, idx) => (
                <div key={design.size} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <DesignCard
                    size={design.size}
                    styleName={formData.styleName}
                    templateId={formData.templateId}
                    aspectRatio={selectedTemplate.aspectRatio}
                    svgContent={design.content}
                    onDownload={(format) => {
                      const fileName = `${formData.styleName}_${design.size}`;
                      if (format === 'svg') downloadSvg(design.content, fileName);
                      else if (format === 'png') downloadPng(design.content, fileName, formData.templateId);
                      else if (format === 'pdf') downloadPdf(design.content, fileName, formData.templateId);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <div className="p-6 bg-slate-50 rounded-full text-slate-300 mb-6">
                <Package size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">선택된 사이즈가 없습니다</h3>
              <p className="text-slate-400 max-w-xs mx-auto">
                좌측 폼에서 스타일 정보와 사이즈를 선택하면 자동으로 도안이 생성됩니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
