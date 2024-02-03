import { Command } from '@commander-js/extra-typings';
import { join } from 'node:path';
import { generatePdf } from './generate-pdf.mjs';

const program = new Command();

program
	.name('generate-pdf')
	.description('CLI to create character sheets')
	.version('0.0.1');

program
	.command('generate')
	.description('Generate a character sheet')
	.option('-s, --system <name>', 'system name', 'sw-weg')
	.option('-t, --template <name>', 'template')
	.option('-c, --character <name>', 'pregen character')
	.option('-o, --output <path>', 'output path', './result.pdf')
	.action(async (options) => {
		console.log(options);
		await generatePdf({
			...options,
			output: join(process.cwd(), options.output),
		});
	});

await program.parseAsync();
