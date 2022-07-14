/* eslint-disable no-param-reassign */
import dlv from 'dlv';
import Parser, {
	type MessagePlaceholder,
	type MessageVariable,
	type MessageAST,
} from '@ffz/icu-msgparser';

import { getCardinal } from './helpers/cardinal';
import { getOrdinal } from './helpers/ordinal';

type Value = string | number | boolean | Date | string[] | number[];

type Args = {
	locale: string;
	messages: object;
};

export default class I18n {
	#locale: string;
	#messages: object;
	#parser: Parser;

	constructor(args: Args) {
		const { locale, messages } = args;

		this.#locale = locale;
		this.#messages = messages;
		this.#parser = new Parser();
	}

	build(prefix?: string) {
		return (key: string, values?: Record<string, Value>) => {
			const lookup = prefix ? dlv(this.#messages, prefix) : this.#messages;
			const message = dlv(lookup, key);
			const parsed = this.#parser.parse(message);

			return parsed.map((p) => this.#resolve(p, values)).join('');
		};
	}

	#resolve(
		placeholder: Value | MessagePlaceholder,
		values: Record<string, Value> = {}
	): Value {
		if (!placeholder) return '';

		if (typeof placeholder !== 'object') {
			return placeholder;
		}

		// not implemented yet
		// @ts-expect-error foobar
		if (placeholder.n) return '';

		const {
			v: value,
			t: type,
			o: options = {},
			f,
		} = placeholder as MessageVariable;

		let v: MessageAST | Value;

		const vs = JSON.parse(JSON.stringify(values));

		switch (type) {
			case 'plural': {
				const n = Number(vs[value]);
				const offset = Number(f || 0);
				const c = getCardinal(n, options, offset, this.#locale);
				vs[value] = n - offset;
				v = options[c];
				break;
			}
			case 'select': {
				const n = `${vs[value]}`;
				v = options[n] || options.other;
				break;
			}
			case 'selectordinal': {
				const n = Number(vs[value]);
				const c = getOrdinal(n, options, this.#locale);
				v = options[c];
				break;
			}
			case 'number': {
				const n = Number(vs[value]);
				const nf = new Intl.NumberFormat(this.#locale, {
					style: f as Intl.NumberFormatOptions['style'],
				});
				v = nf.format(n);
				break;
			}
			case 'date': {
				const n = new Date(vs[value]);
				const df = new Intl.DateTimeFormat(this.#locale, {
					dateStyle: f as Intl.DateTimeFormatOptions['dateStyle'],
				});
				v = df.format(n);
				break;
			}
			case 'time': {
				const n = new Date(vs[value]);
				const df = new Intl.DateTimeFormat(this.#locale, {
					timeStyle: f as Intl.DateTimeFormatOptions['timeStyle'],
				});
				v = df.format(n);
				break;
			}
			default: {
				v = vs[value];
			}
		}

		return Array.isArray(v) ? v.map((p) => this.#resolve(p, vs)).join('') : v;
	}
}
