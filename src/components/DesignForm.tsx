import React from 'react';
import { SIZES, TEMPLATES, TemplateId } from '@/lib/constants';
import { calculateAge } from '@/lib/utils';

export interface DesignFormData {
    templateId: TemplateId;
    styleName: string;
    productCode: string;
    sizeRange: string;
    color: string;
    season: string;
    selectedSizes: string[];
    barcode: string;
    // New fields
    productName: string;
    optionText: string;
    barcodeText: string;
    baseSku: string;
    styleCode: string;
    ageText: string;
    materialText: string;
    makerText: string;
    countryText: string;
    priceText: string;
    addressText: string;
    contactText: string;
    additionalText: string;
}

interface DesignFormProps {
    data: DesignFormData;
    onChange: (data: DesignFormData) => void;
}

export const DesignForm: React.FC<DesignFormProps> = ({ data, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const toggleSize = (size: string) => {
        const newSizes = data.selectedSizes.includes(size)
            ? data.selectedSizes.filter(s => s !== size)
            : [...data.selectedSizes, size];
        onChange({ ...data, selectedSizes: newSizes });
    };

    return (
        <div className="flex flex-col gap-6 p-1 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
                {/* Template Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                    <select
                        name="templateId"
                        value={data.templateId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                        {TEMPLATES.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <hr className="border-slate-100" />

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Style/Product Name</label>
                    <input
                        type="text"
                        name="styleName"
                        value={data.styleName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        placeholder="e.g. Premium Cotton Jacket"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">제품 품번</label>
                        <input
                            type="text"
                            name="productCode"
                            value={data.productCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="000A123"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Color / 컬러</label>
                        <input
                            type="text"
                            name="color"
                            value={data.color}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="NAVY BLUE"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Size / 전체사이즈 (범위)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">/</span>
                        <input
                            type="text"
                            name="sizeRange"
                            value={data.sizeRange}
                            onChange={handleChange}
                            placeholder="예: 100-150"
                            className="w-full px-3 pl-7 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {data.templateId === 'price_tag_40x80' && (
                    <div className="space-y-4 pt-2 border-t border-slate-50">
                        <div>
                            <label className="block text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider text-[10px]">Price Tag Specific Fields</label>
                        </div>
                        {/* Option field removed as per request - will be auto-generated */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700">Age (권장연령)</label>
                                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">AUTO</span>
                                </div>
                                <input
                                    type="text"
                                    name="ageText"
                                    value={data.selectedSizes.length > 0 ? calculateAge(data.selectedSizes[0], data.sizeRange) : data.ageText}
                                    readOnly={true}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed outline-none"
                                    placeholder="Auto-generated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Material (혼용률)</label>
                                <input
                                    type="text"
                                    name="materialText"
                                    value={data.materialText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Cotton 100%"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Maker (제조사)</label>
                                <input
                                    type="text"
                                    name="makerText"
                                    value={data.makerText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Designer Co."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country (제조국)</label>
                                <input
                                    type="text"
                                    name="countryText"
                                    value={data.countryText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Made in Korea"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price (판매가)</label>
                                <input
                                    type="text"
                                    name="priceText"
                                    value={data.priceText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="29,900 KRW"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {data.templateId === 'care_label_30x73' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider text-[10px]">Care Label Specific Fields</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700">Age (사용연령)</label>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md font-bold">AUTO</span>
                                </div>
                                <input
                                    type="text"
                                    name="ageText"
                                    value={data.selectedSizes.length > 0 ? calculateAge(data.selectedSizes[0], data.sizeRange) : data.ageText}
                                    readOnly={true}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed outline-none"
                                    placeholder="Auto-generated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country (제조국)</label>
                                <input
                                    type="text"
                                    name="countryText"
                                    value={data.countryText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="중국"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Material (혼용률)</label>
                            <textarea
                                name="materialText"
                                value={data.materialText}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                placeholder="폴리에스터95%, 폴리우레탄5%"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Info (추가 문구)</label>
                            <input
                                type="text"
                                name="additionalText"
                                value={data.additionalText}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="* 진한 색상 단독 세탁 요망"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address (주소)</label>
                            <textarea
                                name="addressText"
                                value={data.addressText}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                placeholder="경기도 남양주시 진접읍..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Maker (제조사)</label>
                                <input
                                    type="text"
                                    name="makerText"
                                    value={data.makerText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="(주)오픈한"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact (문의)</label>
                                <input
                                    type="text"
                                    name="contactText"
                                    value={data.contactText}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="070-5014-2222"
                                />
                            </div>
                        </div>
                    </div>
                )}


            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sizes (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${data.selectedSizes.includes(size)
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                                : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">출력용 품번 (Full SKU)</label>
                <input
                    type="text"
                    name="baseSku"
                    value={data.baseSku}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="예: D26SS02GOW"
                />
            </div>

        </div>
    );
};
