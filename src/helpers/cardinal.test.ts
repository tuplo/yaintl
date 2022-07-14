import { getCardinal } from './cardinal';

describe('getCardinal', () => {
	it.each([
		[0, '=0'],
		[1, '=1'],
		[2, 'other'],
	])('plural specific number: %s', (value, expected) => {
		const options = {
			'=0': 'zero',
			'=1': 'one',
			other: 'other',
		};
		const actual = getCardinal(value, options, 0, 'en');
		expect(actual).toBe(expected);
	});

	it.each([
		[{ '=0': 'zero', zero: 'zero', other: 'other' }, '=0'],
		[{ zero: 'zero', other: 'other' }, 'zero'],
		[{ other: 'other' }, 'other'],
	])('handles zero rules: %s', (options, expected) => {
		const actual = getCardinal(0, options, 0, 'en');
		expect(actual).toBe(expected);
	});

	it.each([
		[{ '=1': 'one', one: 'one', other: 'other' }, '=1'],
		[{ one: 'one', other: 'other' }, 'one'],
		[{ other: 'other' }, 'other'],
	])('handles one rules: %s', (options, expected) => {
		const actual = getCardinal(1, options, 0, 'en');
		expect(actual).toBe(expected);
	});
});
