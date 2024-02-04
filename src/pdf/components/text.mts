import { rgb, LineCapStyle, breakTextIntoLines } from 'pdf-lib';
import { PDFComponent } from './types.mjs';
import { ptsPerInch } from '../../pdf-info.mjs';

const wordBreaks = [' '];

const calcAlignment = {
	left() {
		return 0;
	},
	center(extraSpace: number) {
		return extraSpace / 2;
	},
	right(extraSpace: number) {
		return extraSpace;
	},
};

export const text: PDFComponent<
	{
		x: number;
		y: number;
		width: number;
		size: number;
		lineHeight?: number;
		maxLines?: number;
		firstLineIndent?: number;
		align?: keyof typeof calcAlignment;
	},
	string
> = (
	page,
	data,
	{
		x,
		y,
		width,
		size,
		lineHeight,
		maxLines = 1,
		align = 'left',
		firstLineIndent = 0,
	},
	{ font },
	{ debug },
) => {
	lineHeight ??= 1.4 * size;

	if (debug) {
		for (let line = 0; line < maxLines; line++) {
			const lineY = y - line * lineHeight;
			const lineX = line === 0 ? x + firstLineIndent : x;
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

	if (typeof data !== 'string') data = `${(data as string) ?? ''}`;

	const textWidth = (t: string) => font.widthOfTextAtSize(t, size);
	const maxWidth = width * ptsPerInch;
	const lines = indentedBreakTextIntoLines(
		data,
		maxWidth - firstLineIndent * ptsPerInch,
		maxWidth,
		textWidth,
	);
	if (lines.length > maxLines)
		console.warn(
			`Too many lines in text: ${data} split into ${lines.length} lines of ${maxLines}`,
		);

	for (let line = 0; line < lines.length; line++) {
		const w = textWidth(lines[line]);
		const offset = calcAlignment[align](maxWidth - w);
		const lineX = line === 0 ? x + firstLineIndent : x;
		page.drawText(lines[line], {
			x: lineX * ptsPerInch + offset,
			y: (y - line * lineHeight) * ptsPerInch,
			size,
			font,
		});
	}
};

function indentedBreakTextIntoLines(
	data: string,
	firstLineWidth: number,
	otherLineWidth: number,
	textWidth: (t: string) => number,
) {
	const initialBreaks = breakTextIntoLines(
		data,
		wordBreaks,
		firstLineWidth,
		textWidth,
	);
	if (initialBreaks.length < 2) return initialBreaks;
	const remainingLineBreaks = breakTextIntoLines(
		initialBreaks.slice(1).join(''),
		wordBreaks,
		otherLineWidth,
		textWidth,
	);
	return [initialBreaks[0], ...remainingLineBreaks];
}
