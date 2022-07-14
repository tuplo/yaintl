/* eslint-disable no-use-before-define */

declare module '@ffz/icu-msgparser' {
	export default Parser;

	function Parser(options?: ParserOptions): Parser;
	class Parser {
		constructor(options?: ParserOptions);

		/**
		 * Parse a message and return a syntax tree, or
		 * throw a SyntaxError if there is an error with
		 * the message's syntax.
		 *
		 * @param input A message in the ICU MessageFormat syntax.
		 * @returns The parsed abstract syntax tree.
		 */
		parse(input: string): MessageAST;
	}

	export type ParserSymbols = {
		OPEN?: string;
		CLOSE?: string;
		TAG_OPEN?: string;
		TAG_CLOSE?: string;
		TAG_CLOSING?: string;
		SEP?: string;
		SUB_VAR?: string;
		ESCAPE?: string;
	};

	export type ParserOptions = ParserSymbols & {
		OFFSET?: string;
		subnumeric_types?: string[];
		submessage_types?: string[];
		allowTags?: boolean;
		requireOther?: boolean | string[];
	};

	export type MessageAST = (string | MessagePlaceholder)[];

	export type MessagePlaceholder = MessageTag | MessageVariable;

	export type MessageTag = {
		n: string;
		c?: MessageAST;
	};

	export type MessageVariable = {
		// We declare n as undefined on variable so that TypeScript users can
		// easily discriminate between variables and tags by checking if n is
		// equal to undefined.
		n: undefined;
		v: string;
		t?: string;
		f?: string | number;
		o?: VariableSubmessages;
	};

	export type VariableSubmessages = {
		[rule: string]: MessageAST;
	};
}
