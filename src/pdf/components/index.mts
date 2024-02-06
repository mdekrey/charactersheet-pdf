import { text } from './text.mjs';
import { table } from './table.mjs';
import { PDFComponent } from './types.mjs';
import { list } from './list.mjs';
import { x } from './x.mjs';

export const components = {
	text,
	table,
	list,
	x,
} as Record<string, PDFComponent>;
