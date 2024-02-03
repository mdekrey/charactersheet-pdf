import { InvalidArgumentError } from '@commander-js/extra-typings';
import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { loadSystemYaml } from './configuration/game-system.mjs';
import { loadTemplateYaml } from './configuration/template.mjs';
import { constructRelativePath } from './paths.mjs';
import { addPdfDebugging } from './addPdfDebugging.mjs';

export async function generatePdf({
	system,
	template: templateKey,
	character,
	debug,
	output,
}: {
	system: string;
	template?: string | undefined;
	character?: string | undefined;
	debug?: true | undefined;
	output: string;
}) {
	const gameSystem = await loadSystemYaml(system);
	if (!gameSystem.spec)
		throw new InvalidArgumentError(`Unknown system: ${system}`);
	const template = await loadTemplateYaml(gameSystem, templateKey);
	if (!template)
		throw new InvalidArgumentError(
			`Template not defined in system: ${templateKey}`,
		);
	if (!template.spec)
		throw new InvalidArgumentError(
			`Unable to locate template at: ${template.path}`,
		);

	const initialPdfBytes = await readFile(
		constructRelativePath(template.path, template.spec.blankSheet),
	);
	const pdfDoc = await PDFDocument.load(initialPdfBytes);
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

	const pages = pdfDoc.getPages();
	if (debug) {
		addPdfDebugging(pages, helveticaFont);
	}

	const firstPage = pages[0];
	firstPage.drawText(character ?? 'no character', {
		x: 5,
		y: 5,
		size: 50,
		font: helveticaFont,
		color: rgb(0.95, 0.1, 0.1),
	});

	const resultBytes = await pdfDoc.save();
	return writeFile(output, resultBytes);
}
