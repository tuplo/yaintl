import { getOrdinal } from './ordinal';

describe('getOrdinal', () => {
	it.each([
		[1, 'one'],
		[11, 'other'],
		[21, 'one'],
		[101, 'one'],
		[2, 'two'],
		[12, 'other'],
		[202, 'two'],
		[3, 'few'],
		[13, 'other'],
		[23, 'few'],
		[103, 'few'],
		[4, 'other'],
	])('ordinal for number: %s', (value, expected) => {
		const options = {
			one: 'st',
			two: 'nd',
			few: 'rd',
			other: 'th',
		};
		const actual = getOrdinal(value, options, 'en-GB');
		expect(actual).toBe(expected);
	});

	it('defaults to other when the category is missing', () => {
		const options = { other: 'the' };
		const actual = getOrdinal(1, options, 'en');
		expect(actual).toBe('other');
	});
});
