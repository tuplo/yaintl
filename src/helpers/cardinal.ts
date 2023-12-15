// https://www.unicode.org/cldr/cldr-aux/charts/29/supplemental/language_plural_rules.html
export function getCardinal(
	n: number,
	options: Record<string, unknown>,
	o: number,
	locale: string,
) {
	const specificNumber = `=${n}`;
	if (specificNumber in options) {
		return specificNumber;
	}

	const nn = typeof o !== "undefined" ? n - Number(o) : n;
	const pr = new Intl.PluralRules(locale, { type: "cardinal" });
	if (nn === 0 && "zero" in options) {
		return "zero";
	}
	const rule = pr.select(nn);

	return rule in options ? rule : "other";
}
