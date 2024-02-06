export const calcAlignment = {
	left() {
		return 0;
	},
	center(extraSpace: number) {
		return extraSpace / 2;
	},
	right(extraSpace: number) {
		return extraSpace;
	},
};
