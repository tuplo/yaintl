export function getOrdinal(
	n: number,
	options: Record<string, unknown>,
	locale: string
) {
	let rule = 'other';

	if (/^en/i.test(locale)) {
		if (n % 10 === 1 && n % 100 !== 11) rule = 'one';
		if (n % 10 === 2 && n % 100 !== 12) rule = 'two';
		if (n % 10 === 3 && n % 100 !== 13) rule = 'few';
	}

	return rule in options ? rule : 'other';
}
