import { text } from './text.mjs';
import { table } from './table.mjs';
import { PDFComponent } from './types.mjs';

export const components = {
	text,
	table,
} as Record<string, PDFComponent>;
