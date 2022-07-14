import I18n from './index';
import messages from './__data__/en.json';

describe('yaintl', () => {
	const i18n = new I18n({ locale: 'en-GB', messages });

	it.each([
		['without prefix', undefined, 'foo', 'bar'],
		['with prefix', 'baz', 'qux', 'quux'],
	])('should build translator function %s', (_, prefix, key, expected) => {
		const t = i18n.build(prefix);
		const actual = t(key);
		expect(actual).toBe(expected);
	});

	it('string lookup', () => {
		const t = i18n.build();
		const actual = t('string.lookup');
		expect(actual).toBe('foobar');
	});

	it.each([
		['one var', 'var1', { name: 'Jed' }, 'His name is Jed.'],
		[
			'two vars',
			'var2',
			{ name: 'Jed', job: 'plumber' },
			'His name is Jed and he works as a plumber.',
		],
	])('variables: %s', (_, key, values, expected) => {
		const t = i18n.build('variables');
		const actual = t(key, values);
		expect(actual).toBe(expected);
	});

	it.each([
		['default', 'male', 'He liked this'],
		['default', 'female', 'She liked this'],
		['default', 'other', 'They liked this'],
		['required', 'male', 'They like this'],
		['required', 'female', 'They like this'],
		['required', 'other', 'They like this'],
	])('select: %s', (key, gender, expected) => {
		const t = i18n.build('select');
		const actual = t(key, { gender });
		expect(actual).toBe(expected);
	});

	it.each([
		[0, 'There are no results.'],
		[1, 'There is one result.'],
		[100, 'There are 100 results.'],
	])('plural: %s', (count, expected) => {
		const t = i18n.build('plural');
		const actual = t('format', { count });
		expect(actual).toBe(expected);
	});

	it.each([
		[1, 'You are 1st in the queue.'],
		[2, 'You are 2nd in the queue.'],
		[42, 'You are 42nd in the queue.'],
		[33, 'You are 33rd in the queue.'],
		[12, 'You are 12th in the queue.'],
	])('selectordinal: %s', (pos, expected) => {
		const t = i18n.build();
		const actual = t('selectordinal', { pos });
		expect(actual).toBe(expected);
	});

	it.each([
		[0, 'No-one has added this'],
		[1, 'You added this'],
		[2, 'You and one other person added this'],
		[3, 'You and 2 others added this'],
	])('plural offset: %s', (adds, expected) => {
		const t = i18n.build();
		const actual = t('plural.offset', { adds });
		expect(actual).toBe(expected);
	});

	it.each([
		['default', 1, 'The default value is 1.'],
		['default', 1_000, 'The default value is 1,000.'],
		['decimal', 7.123, 'The default value is 7.123.'],
		['percent', 0.71, 'The default value is 71%.'],
	])('number: %s', (key, count, expected) => {
		const t = i18n.build('number');
		const actual = t(key, { count });
		expect(actual).toBe(expected);
	});

	it.each([
		['short', 'Sale begins 25/12/2022'],
		['medium', 'Sale begins 25 Dec 2022'],
		['long', 'Sale begins 25 December 2022'],
		['full', 'Sale begins Sunday, 25 December 2022'],
	])('date: %s', (key, expected) => {
		const t = i18n.build('date');
		const actual = t(key, { start: new Date('2022-12-25') });
		expect(actual).toBe(expected);
	});

	it.each([
		['short', 'Coupon expires at 12:34'],
		['medium', 'Coupon expires at 12:34:00'],
		['long', 'Coupon expires at 12:34:00 GMT'],
		['full', 'Coupon expires at 12:34:00 GMT'],
	])('time: %s', (key, expected) => {
		const t = i18n.build('time');
		const actual = t(key, { expires: new Date('2022-12-25T12:34:00.000Z') });
		expect(actual).toBe(expected);
	});
});
