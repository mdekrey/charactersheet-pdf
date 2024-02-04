import { PDFFont, PDFPage } from 'pdf-lib';
import { TemplateSpec } from '../configuration/template.mjs';
import { Character } from '../configuration/character.mjs';

export function addCharacter(
	pages: PDFPage[],
	{
		character,
		debug,
		font,
	}: {
		template: TemplateSpec;
		character: Character;
		debug?: true;
		font: PDFFont;
	},
) {
	if (debug) pages[0].drawText(character.path, { x: 0, y: 0, size: 10, font });
}
