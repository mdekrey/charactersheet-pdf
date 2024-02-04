import { PDFFont, PDFPage, degrees, rgb } from 'pdf-lib';
import { ptsPerInch } from './pdf-info.mjs';

export function addPdfDebugging(pages: PDFPage[], font: PDFFont) {
	const debugTextSize = ptsPerInch / 8;
	for (const page of pages) {
		const size = page.getSize();
		for (let x = ptsPerInch / 4; x < size.width; x += ptsPerInch / 4) {
			page.drawLine({
				start: { x, y: 5 },
				end: { x, y: size.height },
				color: rgb(0.7, 0.95, 0.95),
				opacity: x % ptsPerInch === 0 ? 0.75 : 0.375,
			});
			const posText = `${x / ptsPerInch}"`;
			page.drawText(posText, {
				x,
				y: 5,
				rotate: degrees(90),
				size: debugTextSize,
				font,
				opacity: 0.5,
			});
			page.drawText(posText, {
				x,
				y: size.height - 5,
				rotate: degrees(-90),
				size: debugTextSize,
				font,
				opacity: 0.5,
			});
		}
		for (let y = ptsPerInch / 4; y < size.height; y += ptsPerInch / 4) {
			page.drawLine({
				start: { x: 5, y },
				end: { x: size.width, y },
				color: rgb(0.7, 0.95, 0.95),
				opacity: y % ptsPerInch === 0 ? 0.75 : 0.375,
			});
			page.drawText(`${y / ptsPerInch}"`, {
				x: 5,
				y,
				size: debugTextSize,
				font,
				opacity: 0.5,
			});
		}
	}
}
