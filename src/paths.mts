import { join, dirname } from 'node:path';

export { join };
export const systemPathRoot = join(import.meta.dirname, `systems`);
export const constructSystemYamlPath = (system: string) =>
	join(systemPathRoot, `${system}/system.yaml`);
export const constructRelativePath = (basePath: string, relativePath: string) =>
	join(dirname(basePath), relativePath);
