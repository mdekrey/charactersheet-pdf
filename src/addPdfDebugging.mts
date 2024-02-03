import { PDFFont, PDFPage, degrees, rgb } from 'pdf-lib';
import { ptsPerInch } from './pdf-info.mjs';

export function addPdfDebugging(pages: PDFPage[], font: PDFFont) {
	const debugTextSize = ptsPerInch / 8;
	for (const page of pages) {
		const size = page.getSize();
		for (let x = ptsPerInch / 4; x < size.width; x += ptsPerInch / 4) {
			const color =
				x % ptsPerInch === 0 ? rgb(0.95, 0.7, 0.7) : rgb(0.95, 0.95, 0.7);
			page.drawLine({
				start: { x, y: 0 },
				end: { x, y: size.height },
				color,
			});
			const posText = `${x / ptsPerInch}"`;
			page.drawText(posText, {
				x,
				y: 0,
				rotate: degrees(90),
				size: debugTextSize,
				font: font,
			});
			page.drawText(posText, {
				x,
				y: size.height,
				rotate: degrees(-90),
				size: debugTextSize,
				font: font,
			});
		}
		for (let y = ptsPerInch / 4; y < size.height; y += ptsPerInch / 4) {
			const color =
				y % ptsPerInch === 0 ? rgb(0.95, 0.7, 0.7) : rgb(0.95, 0.95, 0.7);
			page.drawLine({
				start: { x: 0, y },
				end: { x: size.width, y },
				color,
			});
			page.drawText(`${y / ptsPerInch}"`, {
				x: 0,
				y,
				size: debugTextSize,
				font: font,
			});
		}
	}
}
