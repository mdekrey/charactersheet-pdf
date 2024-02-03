import { access, readFile } from 'node:fs/promises';
import { constructSystemYamlPath } from '../paths.mjs';
import { parse } from 'yaml';

export type UnknownGameSystem = {
	readonly path: string;
	readonly spec: null;
};

export type GameSystem = {
	readonly path: string;
	readonly spec: GameSystemSpec;
};

export type GameSystemSpec = {
	defaultTemplate: string;
	templates: Record<string, { path: string }>;
};

export async function loadSystemYaml(
	system: string,
): Promise<UnknownGameSystem | GameSystem> {
	const systemYamlPath = constructSystemYamlPath(system);
	if (
		!(await access(systemYamlPath).then(
			() => true,
			() => false,
		))
	) {
		return { path: systemYamlPath, spec: null };
	}
	const systemYaml = parse(
		await readFile(systemYamlPath, 'utf-8'),
	) as GameSystemSpec;
	return { path: systemYamlPath, spec: systemYaml };
}
