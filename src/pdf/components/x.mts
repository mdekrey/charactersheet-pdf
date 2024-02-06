import { rgb, LineCapStyle } from 'pdf-lib';
import { PDFComponent } from './types.mjs';
import { ptsPerInch } from '../../pdf-info.mjs';

export type XParameters = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export const x: PDFComponent<XParameters, boolean> = (
	page,
	data,
	{ x, y, width, height },
	context,
	{ debug },
) => {
	const xLeft = x * ptsPerInch;
	const xRight = (x + width) * ptsPerInch;
	const yTop = y * ptsPerInch;
	const yBottom = (y + height) * ptsPerInch;
	if (debug) {
		page.drawRectangle({
			x: xLeft,
			y: yTop,
			width: xRight - xLeft,
			height: yBottom - yTop,
			color: rgb(1, 0.1, 0.1),
			opacity: 0.75,
		});
	}

	if (data) {
		page.drawLine({
			start: { x: xLeft, y: yTop },
			end: { x: xRight, y: yBottom },
			lineCap: LineCapStyle.Round,
			thickness: 2,
			color: rgb(0, 0, 0),
		});
		page.drawLine({
			start: { x: xRight, y: yTop },
			end: { x: xLeft, y: yBottom },
			lineCap: LineCapStyle.Round,
			thickness: 2,
			color: rgb(0, 0, 0),
		});
	}
};
