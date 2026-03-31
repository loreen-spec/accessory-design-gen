export type TemplateId = 'barcode_80x40' | 'price_tag_40x80' | 'care_label_30x73';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  path: string; // Path to SVG file in public folder
  aspectRatio: string; // e.g. "2/3" or "2/1"
}

export const TEMPLATES: TemplateConfig[] = [

  {
    id: 'barcode_80x40',
    name: '폼텍 바코드 라벨 (80x40mm)',
    path: '/templates/label_80x40_barcode.svg',
    aspectRatio: '2/1'
  },
  {
    id: 'price_tag_40x80',
    name: '가격택 라벨 (40x80mm)',
    path: '/templates/price_tag_40x80.svg',
    aspectRatio: '1/2'
  },
  {
    id: 'care_label_30x73',
    name: '케어라벨 (30x73mm)',
    path: '/templates/care_label_30x73.svg',
    aspectRatio: '30/73'
  }
];

export const SIZES = ['90', '100', '110', '120', '130', '140', '150', '160', '170', 'F'];
