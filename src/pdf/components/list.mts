import { rgb, LineCapStyle } from 'pdf-lib';
import { PDFComponent } from './types.mjs';
import { ptsPerInch } from '../../pdf-info.mjs';
import { calcAlignment } from './utils/calcAlignment.mjs';
import { drawBoundedLines } from './text.mjs';

export type ListParameters = {
	x: number;
	y: number;
	width: number;
	lineHeight: number;
	maxLines?: number;
	size: number;
	additionalLineIndent?: number;
	align?: keyof typeof calcAlignment;
};

export const list: PDFComponent<ListParameters, string[]> = (
	page,
	data,
	{
		x,
		y,
		width,
		lineHeight,
		maxLines = 1,
		size,
		additionalLineIndent = 0,
		align = 'left',
	},
	context,
	options,
) => {
	const debug = options.debug;

	if (debug) {
		for (let line = 0; line < maxLines; line++) {
			const lineY = y - line * lineHeight;
			page.drawLine({
				start: { x: x * ptsPerInch, y: lineY * ptsPerInch },
				end: { x: (x + width) * ptsPerInch, y: lineY * ptsPerInch },
				thickness: 2,
				color: rgb(1, 0.1, 0.1),
				opacity: 0.75,
				lineCap: LineCapStyle.Round,
			});
		}
	}

	let additionalLines = 0;
	for (let row = 0; row < data.length; row++) {
		if (row + additionalLines >= maxLines) {
			console.warn(`Too many lines in list: ${data.join(', ')}`);
			break;
		}
		const line = additionalLines + row;
		const indents = Array(maxLines - line)
			.fill(0)
			.map((_, idx) => (idx === 0 ? 0 : additionalLineIndent));
		const drawnLines = drawBoundedLines(
			page,
			{
				data: data[row],
				x,
				width,
				y: y - lineHeight * line,
				size,
				align,
				lineHeight,
				indents,
				maxLines: maxLines - line,
			},
			context,
		);
		if (drawnLines.length > 1) additionalLines += drawnLines.length - 1;
	}
};
