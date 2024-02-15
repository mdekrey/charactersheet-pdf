import { access, readFile } from 'node:fs/promises';
import { constructRelativePath } from '../paths.mjs';
import { parse } from 'yaml';
import { GameSystem } from './game-system.mjs';

export type MissingTemplate = {
	readonly path: string;
	readonly spec: null;
};

export type Template = {
	readonly path: string;
	readonly spec: TemplateSpec;
};

export type TemplateSpec = {
	blankSheet: string;
	pages: TemplatePage[];
};

export type TemplatePage = {
	label?: string;
	instructions: TemplateInstruction[];
};

export type TemplateInstruction = {
	label?: string;
	/** component type key */
	type: string;
	/** JS evaluation value */
	data: string;
	/** Parameters for the component */
	parameters: unknown;
};

export async function loadTemplateYaml(
	gameSystem: GameSystem,
	templateKey: string | undefined,
): Promise<null | MissingTemplate | Template> {
	templateKey ??= gameSystem.spec.defaultTemplate;
	if (!templateKey || !gameSystem.spec.templates[templateKey]) return null;
	const templateYamlPath = constructRelativePath(
		gameSystem.path,
		gameSystem.spec.templates[templateKey].path,
	);
	if (
		!(await access(templateYamlPath).then(
			() => true,
			() => false,
		))
	)
		return { path: templateYamlPath, spec: null };

	const templateYaml = parse(
		await readFile(templateYamlPath, 'utf-8'),
	) as TemplateSpec;
	return { path: templateYamlPath, spec: templateYaml };
}
