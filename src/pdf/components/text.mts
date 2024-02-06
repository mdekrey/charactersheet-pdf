import { rgb, LineCapStyle, breakTextIntoLines, PDFPage } from 'pdf-lib';
import { PDFComponent, PDFComponentContext } from './types.mjs';
import { ptsPerInch } from '../../pdf-info.mjs';
import { calcAlignment } from './utils/calcAlignment.mjs';

const wordBreaks = [' '];

export type TextParameters = {
	x: number;
	y: number;
	width: number;
	size: number;
	lineHeight?: number;
	maxLines?: number;
	indents?: number[];
	align?: keyof typeof calcAlignment;
};

export const text: PDFComponent<TextParameters, string> = (
	page,
	data,
	{ x, y, width, size, lineHeight, maxLines = 1, align = 'left', indents = [] },
	context,
	{ debug },
) => {
	lineHeight ??= 1.4 * size;

	if (debug) {
		for (let line = 0; line < maxLines; line++) {
			const lineY = y - line * lineHeight;
			const lineX = x + (indents[line] ?? 0);
			page.drawLine({
				start: { x: lineX * ptsPerInch, y: lineY * ptsPerInch },
				end: { x: (x + width) * ptsPerInch, y: lineY * ptsPerInch },
				thickness: 2,
				color: rgb(1, 0.1, 0.1),
				opacity: 0.75,
				lineCap: LineCapStyle.Round,
			});
		}
	}

	drawBoundedLines(
		page,
		{
			data,
			size,
			width,
			indents,
			maxLines,
			align,
			x,
			y,
			lineHeight,
		},
		context,
	);
};

export function drawBoundedLines(
	page: PDFPage,
	{
		data,
		size,
		width,
		indents,
		maxLines,
		align,
		x,
		y,
		lineHeight,
	}: {
		data: string;
		size: number;
		width: number;
		indents: number[];
		maxLines: number;
		align: keyof typeof calcAlignment;
		x: number;
		y: number;
		lineHeight: number;
	},
	{ font }: PDFComponentContext,
) {
	if (typeof data !== 'string') data = `${(data as string) ?? ''}`;

	const textWidth = (t: string) => font.widthOfTextAtSize(t, size);
	const maxWidth = width * ptsPerInch;
	const lines = indentedBreakTextIntoLines(
		data,
		maxWidth,
		indents.map((v) => v * ptsPerInch),
		textWidth,
	);
	if (lines.length > maxLines)
		console.warn(
			`Too many lines in text: ${data} split into ${lines.length} lines of ${maxLines}`,
		);

	for (let line = 0; line < lines.length && line < maxLines; line++) {
		const indent = indents[line] ?? 0;
		const w = textWidth(lines[line]);
		const offset = calcAlignment[align](maxWidth - indent * ptsPerInch - w);
		const lineX = x + indent;
		page.drawText(lines[line], {
			x: lineX * ptsPerInch + offset,
			y: (y - line * lineHeight) * ptsPerInch,
			size,
			font,
		});
	}
	return lines;
}

function indentedBreakTextIntoLines(
	data: string,
	baseLineWidth: number,
	decreasedWidths: number[],
	textWidth: (t: string) => number,
) {
	let line = 0;
	const result: string[] = [];
	while (data.length > 0) {
		const lines = breakTextIntoLines(
			data,
			wordBreaks,
			baseLineWidth - (decreasedWidths[line] ?? 0),
			textWidth,
		);
		if (line > decreasedWidths.length) {
			result.push(...lines);
			break;
		}
		if (lines.length > 0) result.push(lines[0]);
		data = lines.slice(1).join('');
		line++;
	}
	return result;
}
