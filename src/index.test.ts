import I18n from "./index";
import type { IFormats } from "./index";
import messages from "./__data__/en.json";

describe("yaintl", () => {
	describe("simple", () => {
		const i18n = new I18n({ locale: "en-GB", messages });

		it.each([
			["without prefix", undefined, "foo", "bar"],
			["with prefix", "baz", "qux", "quux"],
		])("should build translator function %s", (_, prefix, key, expected) => {
			const t = i18n.build(prefix);
			const actual = t(key);
			expect(actual).toBe(expected);
		});

		it("string lookup", () => {
			const t = i18n.build();
			const actual = t("string.lookup");
			expect(actual).toBe("foobar");
		});

		it.each([
			["without prefix", undefined, "not.found", "not.found"],
			["with prefix", "not", "found", "not.found"],
		])("returns the key when key not found %s", (_, prefix, key, expected) => {
			const t = i18n.build(prefix);
			const actual = t(key);
			expect(actual).toBe(expected);
		});

		it.each([
			["one var", "var1", { name: "Jed" }, "His name is Jed."],
			[
				"two vars",
				"var2",
				{ name: "Jed", job: "plumber" },
				"His name is Jed and he works as a plumber.",
			],
		])("placeholders: %s", (_, key, values, expected) => {
			const t = i18n.build("variables");
			const actual = t(key, values);
			expect(actual).toBe(expected);
		});

		it.each([
			["default", "male", "He liked this"],
			["default", "female", "She liked this"],
			["default", "other", "They liked this"],
			["required", "male", "They like this"],
			["required", "female", "They like this"],
			["required", "other", "They like this"],
		])("select: %s", (key, gender, expected) => {
			const t = i18n.build("select");
			const actual = t(key, { gender });
			expect(actual).toBe(expected);
		});
	});

	describe("plurals", () => {
		it.each([
			[0, "There are no results."],
			[1, "There is one result."],
			[100, "There are 100 results."],
		])("plural: %s", (count, expected) => {
			const m = {
				plural:
					"{count, plural, =0 {There are no results.} one {There is one result.} other {There are # results.}}",
			};
			const i = new I18n({ locale: "en-GB", messages: m });
			const t = i.build();
			const actual = t("plural", { count });
			expect(actual).toBe(expected);
		});

		it.each([
			[1, "You are 1st in the queue."],
			[2, "You are 2nd in the queue."],
			[42, "You are 42nd in the queue."],
			[33, "You are 33rd in the queue."],
			[12, "You are 12th in the queue."],
		])("selectordinal: %s", (pos, expected) => {
			const m = {
				selectordinal:
					"You are {pos, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} in the queue.",
			};
			const i = new I18n({ locale: "en-GB", messages: m });
			const t = i.build();
			const actual = t("selectordinal", { pos });
			expect(actual).toBe(expected);
		});

		it.each([
			[0, "No-one has added this"],
			[1, "You added this"],
			[2, "You and one other person added this"],
			[3, "You and 2 others added this"],
		])("plural offset: %s", (adds, expected) => {
			const m = {
				plural:
					"{adds, plural, offset:1 =0 {No-one has added this} =1 {You added this} one {You and one other person added this} other {You and # others added this}}",
			};
			const i = new I18n({ locale: "en-GB", messages: m });
			const t = i.build();
			const actual = t("plural", { adds });
			expect(actual).toBe(expected);
		});

		it.each([
			[0, ""],
			[1, ""],
			[100, "(100)"],
		])("handles an empty message for zero", (count, expected) => {
			const m = { plural: "{count, plural, =0 {} one {} other {(#)}}" };
			const i = new I18n({ locale: "en-GB", messages: m });
			const t = i.build();
			const actual = t("plural", { count });

			expect(actual).toBe(expected);
		});
	});

	describe("default formats", () => {
		const i18n = new I18n({ locale: "en-GB", messages });

		it.each([
			["default", 1, "The default value is 1."],
			["default", 1_000, "The default value is 1,000."],
			["decimal", 7.123, "The default value is 7.123."],
			["percent", 0.71, "The default value is 71%."],
		])("number: %s", (key, count, expected) => {
			const t = i18n.build("defaultFormats.number");
			const actual = t(key, { count });
			expect(actual).toBe(expected);
		});

		it.each([
			["short", "Sale begins 25/12/2022"],
			["medium", "Sale begins 25 Dec 2022"],
			["long", "Sale begins 25 December 2022"],
			["full", "Sale begins Sunday, 25 December 2022"],
		])("date: %s", (key, expected) => {
			const t = i18n.build("defaultFormats.date");
			const actual = t(key, { start: new Date("2022-12-25") });
			expect(actual).toBe(expected);
		});

		it.each([
			["short", "Coupon expires at 12:34"],
			["medium", "Coupon expires at 12:34:00"],
			["long", "Coupon expires at 12:34:00 GMT"],
			["full", "Coupon expires at 12:34:00 GMT"],
		])("time: %s", (key, expected) => {
			const t = i18n.build("defaultFormats.time");
			const actual = t(key, { expires: new Date("2022-12-25T12:34:00.000Z") });
			expect(actual).toBe(expected);
		});

		it.each([
			["default", "With Alice, Bob and Charlie"],
			["long", "With Alice, Bob and Charlie"],
			["short", "With Alice, Bob and Charlie"],
			["narrow", "With Alice, Bob, Charlie"],
		])("list: %s", (key, expected) => {
			const t = i18n.build("defaultFormats.list");
			const actual = t(key, { team: ["Alice", "Bob", "Charlie"] });
			expect(actual).toBe(expected);
		});
	});

	describe("custom formats", () => {
		it.each([
			["number1", "The value is 1.235E9."],
			["number2", "The value is +1,234,567,890."],
		])("number: %s", (key, expected) => {
			const formats: IFormats = {
				number: {
					fmtNumber1: { notation: "scientific" },
					fmtNumber2: { signDisplay: "exceptZero" },
				},
			};
			const i18n = new I18n({ locale: "en-GB", messages, formats });
			const t = i18n.build("customFormats.number");
			const actual = t(key, { count: 1_234_567_890 });
			expect(actual).toBe(expected);
		});

		it.each([
			["date1", "Sale begins 25 Dec"],
			["date2", "Sale begins December"],
		])("date: %s", (key, expected) => {
			const formats: IFormats = {
				dateTime: {
					fmtDate1: { day: "numeric", month: "short" },
					fmtDate2: { month: "long" },
				},
			};
			const i18n = new I18n({ locale: "en-GB", messages, formats });
			const t = i18n.build("customFormats.date");
			const actual = t(key, { start: new Date("2022-12-25") });
			expect(actual).toBe(expected);
		});

		it.each([
			["time1", "Sale begins 23:30"],
			["time2", "Sale begins 15:30"],
		])("time: %s", (key, expected) => {
			const formats: IFormats = {
				dateTime: {
					fmtTime1: { timeStyle: "short" },
					fmtTime2: { timeZone: "America/Los_Angeles", timeStyle: "short" },
				},
			};
			const i18n = new I18n({ locale: "en-GB", messages, formats });
			const t = i18n.build("customFormats.time");
			const actual = t(key, { start: new Date("2022-12-25T23:30:00.000Z") });
			expect(actual).toBe(expected);
		});

		it.each([
			["list1", "With Alice, Bob and Charlie"],
			["list2", "With Alice, Bob or Charlie"],
		])("time: %s", (key, expected) => {
			const formats: IFormats = {
				list: {
					fmtList1: { style: "long" },
					fmtList2: { type: "disjunction" },
				},
			};
			const i18n = new I18n({ locale: "en-GB", messages, formats });
			const t = i18n.build("customFormats.list");
			const actual = t(key, { team: ["Alice", "Bob", "Charlie"] });
			expect(actual).toBe(expected);
		});
	});
});
