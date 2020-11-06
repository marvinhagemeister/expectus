import { deepEqual } from "./deep";
import { formatType } from "./print";

const noArg = "__no_argument__";

export class AssertionError extends Error {
	constructor(
		public message: string,
		public actual: any = noArg,
		public expected: any = noArg,
		public showDiff = actual !== noArg && expected !== noArg
	) {
		super(message);
	}
}

function _assert(options: {
	result: boolean;
	invert: boolean;
	message: string;
	messageNot: string;
	actual?: any;
	expected?: any;
}) {
	let { result, actual, expected, invert, message, messageNot } = options;
	if ((!result && !invert) || (result && invert)) {
		message = (invert ? messageNot : message)
			.replace(/\#\{this\}/g, formatType(actual))
			.replace(/\#\{exp\}/g, formatType(expected))
			.replace(/\#\{act\}/g, formatType(actual));
		throw new AssertionError(message, actual, expected);
	}
}

export function objectIs<T>(actual: T, expected: T, message?: string) {
	_assert({
		result: Object.is(actual, expected),
		message: `Expeced #{act} to equal #{exp} via Object.is equality`,
		messageNot: `Expected #{act} not to equal #{exp} via Object.is equality`,
		actual,
		expected,
	});
}

export function isFalse(actual: any, message?: string) {
	_assert({
		result: actual === false,
		message: `Expected #{act} to be false`,
		messageNot: `Expected #{act} not to be false`,
		actual,
		expected: false,
	});
}

export function isNull(actual: any, message?: string) {
	_assert({
		result: actual === null,
		message: `Expected #{act} to be null`,
		messageNot: `Expected #{act} not to be null`,
		actual,
		expected: null,
	});
}

export function isEqual<T>(actual: T, expected: T, message?: string) {
	const prefix = message ? message + ": " : "";
	_assert({
		result: actual === expected,
		message: `${prefix}Expected #{act} to strictly equal #{exp}`,
		messageNot: `${prefix}Expected #{act} not to strictly equal #{exp}`,
		actual,
		expected,
	});
}

export function isDeepEqual<T>(actual: T, expected: T, message?: string) {
	const prefix = null;
	_assert({
		result: deepEqual(actual, expected),
		message: `${prefix}Expected #{act} to deeply equal #{exp}`,
		messageNot: `${prefix}Expected #{act} not to deeply equal #{exp}`,
		actual,
		expected,
	});
}
