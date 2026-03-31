import React from 'react';
import { Download } from 'lucide-react';

interface DesignCardProps {
    svgContent: string;
    size: string;
    styleName: string;
    templateId: string;
    aspectRatio: string;
    onDownload: (format: 'svg' | 'png' | 'pdf') => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({ svgContent, size, styleName, templateId, aspectRatio, onDownload }) => {
    const isPriceTag = templateId === 'price_tag_40x80';
    const isCareLabel = templateId === 'care_label_30x73';
    const useTightPadding = isPriceTag || isCareLabel;

    return (
        <div className={`bg-white rounded-xl shadow-lg border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${useTightPadding ? 'p-2' : 'p-4'}`}>
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    Size {size}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onDownload('svg')}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Download SVG"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            <div
                className={`w-full flex justify-center bg-slate-50 rounded-lg overflow-hidden border border-slate-100 mb-2 ${isCareLabel ? 'items-start pt-4' : 'items-center'}`}
                style={{
                    aspectRatio: isCareLabel ? '30/73' : aspectRatio,
                    height: useTightPadding ? 'auto' : undefined,
                }}
            >
                {isCareLabel ? (
                    <div
                        className="w-full h-full flex justify-center relative"
                        style={{
                            transform: 'scale(1.7)',
                            transformOrigin: 'top center',
                        }}
                    >
                        <div
                            className="w-full h-full flex justify-center"
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                        
                        {/* KC Logo Overlay - Tied to the scaled domain */}
                        <img 
                            src="/assets/kc-logo.png" 
                            alt="KC logo" 
                            style={{
                                position: 'absolute',
                                left: '80.6%', // Near the end of Country line (x=242/300)
                                top: '66.7%',   // Center-aligned with Country line (y=487/730)
                                width: '8.3%', // Small size (25/300)
                                height: 'auto',
                                pointerEvents: 'none'
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex justify-center items-center"
                        style={{
                            transform: isPriceTag ? 'scale(1.4)' : 'none',
                            transformOrigin: 'center center',
                        }}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                )}
            </div>

            <div className="flex flex-col gap-2 px-2 pb-2">
                <button
                    onClick={() => onDownload('png')}
                    className="w-full py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    PNG Download
                </button>
                <button
                    onClick={() => onDownload('pdf')}
                    className="w-full py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    PDF Download
                </button>
            </div>
        </div>
    );
};
