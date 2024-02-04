import { access, readFile } from 'node:fs/promises';
import { constructCharacterPath } from '../paths.mjs';
import { parse } from 'yaml';

export type UnknownCharacter = {
	readonly path: string;
	readonly spec: null;
};

export type Character = {
	readonly path: string;
	readonly spec: unknown;
};

export async function loadCharacterSpec(system: string, character: string) {
	const characterYamlPath = constructCharacterPath(system, character);
	if (
		!(await access(characterYamlPath).then(
			() => true,
			() => false,
		))
	) {
		return { path: characterYamlPath, spec: null };
	}
	const characterYaml: unknown = parse(
		await readFile(characterYamlPath, 'utf-8'),
	);
	return { path: characterYamlPath, spec: characterYaml };
}
