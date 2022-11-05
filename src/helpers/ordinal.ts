export function getOrdinal(
	n: number,
	options: Record<string, unknown>,
	locale: string
) {
	const pr = new Intl.PluralRules(locale, { type: 'ordinal' });
	const rule = pr.select(n);

	return rule in options ? rule : 'other';
}
