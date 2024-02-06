import { rgb, LineCapStyle } from 'pdf-lib';
import { PDFComponent } from './types.mjs';
import { ptsPerInch } from '../../pdf-info.mjs';
import { calcAlignment } from './utils/calcAlignment.mjs';
import { drawBoundedLines } from './text.mjs';

export type TableColumn = {
	width: number;
	size: number;
	additionalLineIndent?: number;
	align?: keyof typeof calcAlignment;
};

export type TableParameters = {
	x: number;
	y: number;
	width: number;
	lineHeight: number;
	maxLines?: number;
	columns: TableColumn[];
};

export const table: PDFComponent<TableParameters, string[][]> = (
	page,
	data,
	{ x, y, width, lineHeight, maxLines = 1, columns },
	context,
	options,
) => {
	const debug = options.debug;

	const fullColumns = columns.map((col) => ({
		...col,
		align: col.align ?? 'left',
		x: 0,
	}));
	const usedWidth = fullColumns.map((c) => c.width).reduce((a, b) => a + b, 0);
	const remainingWidth = width - usedWidth;
	const xGap = remainingWidth / (fullColumns.length - 1);
	fullColumns.reduce((currentLeft, col) => {
		col.x = currentLeft;
		return col.x + col.width + xGap;
	}, x);

	if (debug) {
		for (let line = 0; line < maxLines; line++) {
			const lineY = y - line * lineHeight;
			for (const col of fullColumns) {
				page.drawLine({
					start: { x: col.x * ptsPerInch, y: lineY * ptsPerInch },
					end: { x: (col.x + col.width) * ptsPerInch, y: lineY * ptsPerInch },
					thickness: 2,
					color: rgb(1, 0.1, 0.1),
					opacity: 0.75,
					lineCap: LineCapStyle.Round,
				});
			}
		}
	}

	let additionalLines = 0;
	for (
		let row = 0;
		row + additionalLines < maxLines && row < data.length;
		row++
	) {
		const line = additionalLines + row;
		for (let col = 0; col < fullColumns.length; col++) {
			const { additionalLineIndent } = fullColumns[col];
			const indents =
				additionalLineIndent === undefined
					? []
					: Array(maxLines - line)
							.fill(0)
							.map((_, idx) => (idx === 0 ? 0 : additionalLineIndent));
			const drawnLines = drawBoundedLines(
				page,
				{
					data: data[row][col],
					x: fullColumns[col].x,
					width: fullColumns[col].width,
					y: y - lineHeight * line,
					size: fullColumns[col].size,
					align: fullColumns[col].align,
					lineHeight,
					indents,
					maxLines: maxLines - line,
				},
				context,
			);
			if (drawnLines.length > 1) additionalLines += drawnLines.length - 1;
		}
	}
};
