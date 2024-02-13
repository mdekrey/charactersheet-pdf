import { PDFPage } from 'pdf-lib';
import { TemplatePage, TemplateSpec } from '../configuration/template.mjs';
import { Character } from '../configuration/character.mjs';
import { components } from './components/index.mjs';
import {
	PDFComponentContext,
	PDFComponentOptions,
} from './components/types.mjs';

export function addCharacter(
	pages: PDFPage[],
	template: TemplateSpec,
	character: Character | null,
	initialContext: Pick<PDFComponentContext, 'font'>,
	options: PDFComponentOptions,
) {
	const font = initialContext.font;
	const debug = options.debug;
	const context = {
		...initialContext,
	};
	if (debug && character?.path)
		pages[0].drawText(character.path, { x: 4, y: 4, size: 10, font });

	for (let i = 0; i < template.pages.length; i++) {
		const templatePage = template.pages[i];
		const page = pages[i];
		if (!page) {
			console.error(`Unknown page: ${i + 1}`);
			continue;
		}
		if (debug && templatePage.label)
			page.drawText(templatePage.label, { x: 4, y: 4, size: 10, font });

		applyInstructions(page, templatePage);
	}

	function applyInstructions(page: PDFPage, templatePage: TemplatePage) {
		for (const instruction of templatePage.instructions) {
			const component = components[instruction.type];
			if (!component) {
				console.error(`Unknown component type: ${instruction.type}`);
				continue;
			}

			const data = safeResolveData(character?.spec, instruction.data);
			component(page, data, instruction.parameters, context, options);
		}
	}
}

/** Safely uses eval to only access the first parameter as `$` */
function safeResolveData($: unknown, data: string): unknown {
	try {
		('use strict');
		return eval(data);
	} catch (ex) {
		if ($)
			console.warn(
				`Unable to resolve ${data}, due to error: ${ex?.toString()}`,
			);
		return undefined;
	}
}
