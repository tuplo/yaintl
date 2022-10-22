/* eslint-disable no-param-reassign */
import type {
	MessageAST,
	MessagePlaceholder,
	MessageVariable,
} from '@ffz/icu-msgparser';
import Parser from '@ffz/icu-msgparser';
import dlv from 'dlv';

import { getCardinal } from './helpers/cardinal';
import { getOrdinal } from './helpers/ordinal';

type Value = unknown;

export type Formats = {
	number?: Record<string, Intl.NumberFormatOptions>;
	dateTime?: Record<string, Intl.DateTimeFormatOptions>;
	list?: Record<string, Intl.ListFormatOptions>;
};

type Args = {
	locale: string;
	messages: object;
	formats?: Formats;
};

export default class I18n {
	#locale: string;
	#messages: object;
	#formats?: Formats;
	#parser: Parser;

	constructor(args: Args) {
		const { locale, messages, formats } = args;

		this.#locale = locale;
		this.#messages = messages;
		this.#formats = formats;
		this.#parser = new Parser();
	}

	build(prefix?: string) {
		return (key: string, values?: Record<string, Value>) => {
			const lookup = prefix ? dlv(this.#messages, prefix) : this.#messages;
			const message = dlv(lookup, key);
			if (!message) return [prefix, key].filter(Boolean).join('.');

			const parsed = this.#parser.parse(message);
			return parsed.map((p) => this.#resolve(p, values)).join('');
		};
	}

	#resolve(
		placeholder: Value | MessagePlaceholder,
		values: Record<string, Value> = {}
	): Value {
		if (typeof placeholder !== 'object') {
			return placeholder;
		}

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
				const dfOptions = dlv(this.#formats || {}, `number.${f}`, {
					style: f,
				});
				const nf = new Intl.NumberFormat(this.#locale, dfOptions);
				v = nf.format(n);
				break;
			}
			case 'date': {
				const n = new Date(vs[value]);
				const fmt = dlv(this.#formats || {}, `dateTime.${f}`, { dateStyle: f });
				const df = new Intl.DateTimeFormat(this.#locale, fmt);
				v = df.format(n);
				break;
			}
			case 'time': {
				const n = new Date(vs[value]);
				const fmt = dlv(this.#formats || {}, `dateTime.${f}`, { timeStyle: f });
				const df = new Intl.DateTimeFormat(this.#locale, fmt);
				v = df.format(n);
				break;
			}
			case 'list': {
				const n = vs[value];
				const fmt = dlv(this.#formats || {}, `list.${f}`, { style: f });
				const lf = new Intl.ListFormat(this.#locale, fmt);
				v = lf.format(n);
				break;
			}
			default: {
				v = vs[value];
			}
		}

		return Array.isArray(v) ? v.map((p) => this.#resolve(p, vs)).join('') : v;
	}
}
