# charactersheet-pdf

A CLI for filling out character sheet PDFs - especially for one-shots.

## Running

1. Clone out the repository
2. Run `pnpm install`
3. Run `pnpm generate-pdf` - with the following switches:
	- `-s <name>` or `--system <name>` - set the game system.

		Supported values include:
		- sw-weg

	- `-t <name>` or `--template <name>` - name of the template to use.

		Dependent on the system, this setting allows for alternate playbooks or sheet types, like starships, spell sheets, etc.

	- `-c <name>` or `--character <name>` - name of the character.

		This looks in `./characters/<system>/<character-name>.yaml` for a corresponding character. The name is converted to kebab-case to find the file.

		If a character is not provided, a blank PDF for the system will be rendered.

	- `-o <path>` or `--output <path>` - the path at which to generate the PDF.

		If not provided, defaults to `./result.pdf`

	- `-d` or `--debug` - add debug info to the PDF.

		Adds a bunch of red outlines to the PDF for debugging layout.

