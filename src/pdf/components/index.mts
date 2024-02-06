import { text } from './text.mjs';
import { table } from './table.mjs';
import { PDFComponent } from './types.mjs';
import { list } from './list.mjs';

export const components = {
	text,
	table,
	list,
} as Record<string, PDFComponent>;
