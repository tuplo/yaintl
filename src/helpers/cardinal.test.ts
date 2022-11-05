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

	it.each([
		[0, 1, 'No-one'],
		[1, 1, 'You'],
		[2, 1, 'You and one other'],
		[3, 1, 'You and 2 others'],
	])('handles offsets: %s %s', (n, offset, expected) => {
		const options: Record<string, string> = {
			'=0': 'No-one',
			'=1': 'You',
			one: 'You and one other',
			other: 'You and 2 others',
		};
		const cardinal = getCardinal(n, options, offset, 'en');
		const actual = options[cardinal];
		expect(actual).toBe(expected);
	});
});
