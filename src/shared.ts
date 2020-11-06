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
	customMessage?: string;
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

export interface BaseOptions {
	message?: string;
	invert: boolean;
}

export function objectIs<T>(
	actual: T,
	expected: T,
	{ message, invert }: BaseOptions
) {
	_assert({
		result: Object.is(actual, expected),
		invert,
		customMessage: message,
		message: `Expeced #{act} to equal #{exp} via Object.is equality`,
		messageNot: `Expected #{act} not to equal #{exp} via Object.is equality`,
		actual,
		expected,
	});
}

export function isFalse(actual: any, { message, invert }: BaseOptions) {
	_assert({
		customMessage: message,
		invert,
		result: actual === false,
		message: `Expected #{act} to be false`,
		messageNot: `Expected #{act} not to be false`,
		actual,
		expected: false,
	});
}

export function isNull(actual: any, { message, invert }: BaseOptions) {
	_assert({
		customMessage: message,
		invert,
		result: actual === null,
		message: `Expected #{act} to be null`,
		messageNot: `Expected #{act} not to be null`,
		actual,
		expected: null,
	});
}

export function isUndefined(actual: any, { message, invert }: BaseOptions) {
	_assert({
		customMessage: message,
		invert,
		result: actual === undefined,
		message: `Expected #{act} to be undefined`,
		messageNot: `Expected #{act} not to be undefined`,
		actual,
		expected: null,
	});
}

export function isEqual<T>(
	actual: T,
	expected: T,
	{ message, invert }: BaseOptions
) {
	_assert({
		customMessage: message,
		invert,
		result: actual === expected,
		message: `Expected #{act} to strictly equal #{exp}`,
		messageNot: `Expected #{act} not to strictly equal #{exp}`,
		actual,
		expected,
	});
}

export function isDeepEqual<T>(
	actual: T,
	expected: T,
	{ message, invert }: BaseOptions
) {
	_assert({
		customMessage: message,
		invert,
		result: deepEqual(actual, expected),
		message: `Expected #{act} to deeply equal #{exp}`,
		messageNot: `Expected #{act} not to deeply equal #{exp}`,
		actual,
		expected,
	});
}

export function isAssertNaN(actual: number, { message, invert }: BaseOptions) {
	_assert({
		customMessage: message,
		invert,
		result: isNaN(actual),
		message: `Expected #{act} to deeply equal #{exp}`,
		messageNot: `Expected #{act} not to deeply equal #{exp}`,
		actual,
		expected: NaN,
	});
}

export function isMatch(
	actual: string,
	regex: RegExp,
	{ message, invert }: BaseOptions
) {
	if (typeof actual !== "string") {
		throw new Error(`Expected a string, but got ${typeof actual} instead`);
	}

	_assert({
		customMessage: message,
		invert,
		result: regex.test(actual),
		message: `Expected #{act} to match #{exp}`,
		messageNot: `Expected #{act} not to match #{exp}`,
		actual,
		expected: regex,
	});
}

export function doesInclude<T>(
	haystack: any,
	needle: T,
	{ message, invert }: BaseOptions
) {
	let result = false;
	if (Array.isArray(haystack)) {
		result = haystack.includes(needle);
	} else if (haystack instanceof Map || haystack instanceof Set) {
		result = haystack.has(needle);
	} else {
		throw new Error(`Expected a collection`);
	}

	_assert({
		customMessage: message,
		invert,
		result: result,
		message: `Expected #{act} to include #{exp}`,
		messageNot: `Expected #{act} not to include #{exp}`,
		actual: haystack,
		expected: needle,
	});
}

export function doesIncludeShape<T>(
	haystack: any,
	needle: T,
	{ message, invert }: BaseOptions
) {
	let result = false;
	if (Array.isArray(haystack)) {
		result = !!haystack.find(item => deepEqual(item, needle));
	} else if (haystack instanceof Map || haystack instanceof Set) {
		const arr: any[] = [];
		haystack.forEach((x: any) => arr.push(x));
		result = !!arr.find(item => deepEqual(item, needle));
	} else {
		throw new Error(`Expected a collection`);
	}

	_assert({
		customMessage: message,
		invert,
		result: result,
		message: `Expected #{act} to include equal to #{exp}`,
		messageNot: `Expected #{act} not to include equal to #{exp}`,
		actual: haystack,
		expected: needle,
	});
}

export function doesThrow(
	fn: any,
	expected?: RegExp | string | Error,
	options: Partial<BaseOptions> = {}
) {
	if (typeof fn !== "function") {
		throw new Error("Expected a function");
	}
	const { message, invert = false } = options;

	let result = false;
	try {
		fn();
		_assert({
			customMessage: message,
			invert,
			result: false,
			message: `Expected #{act} to throw #{exp}`,
			messageNot: `Expected #{act} not to throw #{exp}`,
			actual: fn,
			expected,
		});
	} catch (err) {
		if (!(err instanceof Error)) {
			throw new Error("Expected an Error object to be thrown");
		}
		if (expected instanceof RegExp) {
			result = expected.test(err.message);
		} else if (typeof expected === "string") {
			result = err.message.includes(expected);
		} else {
			result = err instanceof (expected as any);
		}

		// TODO: Messages
		_assert({
			customMessage: message,
			invert,
			result: result,
			message: `Expected #{act} to throw #{exp}`,
			messageNot: `Expected #{act} not to throw #{exp}`,
			actual: err,
			expected,
		});
	}
}
