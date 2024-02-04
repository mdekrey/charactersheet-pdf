import { InvalidArgumentError } from '@commander-js/extra-typings';
import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { loadSystemYaml } from './configuration/game-system.mjs';
import { loadTemplateYaml } from './configuration/template.mjs';
import { constructRelativePath } from './paths.mjs';
import { addPdfDebugging } from './addPdfDebugging.mjs';
import { loadCharacterSpec } from './configuration/character.mjs';
import { addCharacter } from './pdf/addCharacter.mjs';

export async function generatePdf({
	system,
	template: templateKey,
	character: characterName,
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
	const character = characterName
		? await loadCharacterSpec(system, characterName)
		: null;
	if (characterName && !character?.spec)
		throw new InvalidArgumentError(
			`Unable to locate character named '${characterName}' for ${system}`,
		);

	const initialPdfBytes = await readFile(
		constructRelativePath(template.path, template.spec.blankSheet),
	);
	const pdfDoc = await PDFDocument.load(initialPdfBytes);
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

	const pages = pdfDoc.getPages();
	if (debug) {
		addPdfDebugging(pages, font);
	}

	if (character?.spec)
		addCharacter(pages, { template: template.spec, character, debug, font });

	const resultBytes = await pdfDoc.save();
	return writeFile(output, resultBytes);
}
