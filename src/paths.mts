import { join, dirname } from 'node:path';
import { kebabCase } from 'change-case';

export { join };
export const systemPathRoot = join(import.meta.dirname, `systems`);
export const constructSystemYamlPath = (system: string) =>
	join(systemPathRoot, `${system}/system.yaml`);
export const constructRelativePath = (basePath: string, relativePath: string) =>
	join(dirname(basePath), relativePath);
export const constructCharacterPath = (system: string, character: string) =>
	join(
		import.meta.dirname,
		'../characters',
		system,
		`${kebabCase(character)}.yaml`,
	);
