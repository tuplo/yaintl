/* eslint-disable @typescript-eslint/no-unused-vars */

// https://www.unicode.org/cldr/cldr-aux/charts/29/supplemental/language_plural_rules.html
export function getCardinal(
	n: number,
	options: Record<string, unknown>,
	o: number,
	locale: string
) {
	const specificNumber = `=${n}`;
	if (specificNumber in options) {
		return specificNumber;
	}

	const nn = n - Number(o);
	if (nn === 0 && 'zero' in options) {
		return 'zero';
	}

	if (nn === 1 && 'one' in options) {
		return 'one';
	}

	return 'other';
}
