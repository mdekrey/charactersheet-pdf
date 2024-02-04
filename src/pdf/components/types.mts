import { PDFFont, PDFPage } from 'pdf-lib';

export type PDFComponentContext = { font: PDFFont };
export type PDFComponentOptions = {
	debug?: true;
};

export type PDFComponent<TParams = unknown, TData = unknown> = {
	(
		page: PDFPage,
		data: TData,
		parameters: TParams,
		context: PDFComponentContext,
		options: PDFComponentOptions,
	): void;
};
