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
	customMessage?: string;
	invert?: boolean;
}

export function createAssertion<T, U>(opts: {
	message: string;
	messageNot: string;
	fn: (actual: T, expected: U) => boolean;
	getActual?: (actual: T) => any;
}) {
	return (actual: T, expected: U, options: BaseOptions = {}) => {
		const result = opts.fn(actual, expected);
		_assert({
			result,
			invert: !!options.invert,
			customMessage: options.customMessage,
			message: opts.message,
			messageNot: opts.messageNot,
			actual: opts.getActual ? result : actual,
			expected,
		});
	};
}

export const isPrimitive = createAssertion({
	message: `Expected #{act} to be #{exp}`,
	messageNot: `Expected #{act} not to be #{exp}`,
	fn: (actual, expected) =>
		isNaN(expected as any) ? Object.is(actual, expected) : actual === expected,
});

export const isFalsy = createAssertion({
	message: `Expected #{act} to be falsy`,
	messageNot: `Expected #{act} not to be falsy`,
	fn: actual => !actual,
});

export const isTruthy = createAssertion({
	message: `Expected #{act} to be truthy`,
	messageNot: `Expected #{act} not to be truthy`,
	fn: actual => !!actual,
});

export const isGreaterThan = createAssertion<number, number>({
	message: `Expected #{act} to be greater than #{exp}`,
	messageNot: `Expected #{act} not to be greater than #{exp}`,
	fn: (actual, expected) => actual > expected,
});

export const isGreaterThanOrEqual = createAssertion<number, number>({
	message: `Expected #{act} to be greater than or equal to #{exp}`,
	messageNot: `Expected #{act} not to be greater than or equal to #{exp}`,
	fn: (actual, expected) => actual >= expected,
});

export const isLessThan = createAssertion<number, number>({
	message: `Expected #{act} to be less than #{exp}`,
	messageNot: `Expected #{act} not to be less than #{exp}`,
	fn: (actual, expected) => actual < expected,
});

export const isLessThanOrEqual = createAssertion<number, number>({
	message: `Expected #{act} to be less than or equal to #{exp}`,
	messageNot: `Expected #{act} not to be less than or equal to #{exp}`,
	fn: (actual, expected) => actual <= expected,
});

export const isInstanceOf = createAssertion<any, any>({
	message: `Expected #{act} to be an instance of #{exp}`,
	messageNot: `Expected #{act} not to be an instance of #{exp}`,
	fn: (actual, expected) => actual instanceof expected,
});

export const isEqual = createAssertion({
	message: `Expected #{act} to strictly equal #{exp}`,
	messageNot: `Expected #{act} not to strictly equal #{exp}`,
	fn: (actual, expected) => actual === expected,
});

export const isDeepEqual = createAssertion({
	message: `Expected #{act} to deeply equal #{exp}`,
	messageNot: `Expected #{act} not to deeply equal #{exp}`,
	fn: deepEqual,
});

export const isMatch = createAssertion<string, RegExp>({
	message: `Expected #{act} to match #{exp}`,
	messageNot: `Expected #{act} not to match #{exp}`,
	fn: (actual, regex) => regex.test(actual),
});

export const doesInclude = createAssertion<
	string | any[] | Set<any> | Map<any, any>,
	any
>({
	message: `Expected #{act} to include #{exp}`,
	messageNot: `Expected #{act} not to include #{exp}`,
	fn: (haystack, needle) => {
		let result = false;
		if (Array.isArray(haystack)) {
			result = haystack.includes(needle);
		} else if (typeof haystack === "string") {
			result = haystack.includes(needle);
		} else if (haystack instanceof Map || haystack instanceof Set) {
			result = haystack.has(needle);
		} else {
			throw new Error(`Expected a collection`);
		}

		return result;
	},
});

export function doesIncludeShape<T>(
	haystack: any,
	needle: T,
	{ customMessage: message, invert }: BaseOptions
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
		invert: !!invert,
		result: result,
		message: `Expected #{act} to include equal to #{exp}`,
		messageNot: `Expected #{act} not to include equal to #{exp}`,
		actual: haystack,
		expected: needle,
	});
}

export const doesThrow = createAssertion<
	() => any,
	undefined | ErrorConstructor | RegExp | string
>({
	message: `Expected #{act} to throw #{exp}`,
	messageNot: `Expected #{act} not to throw #{exp}`,
	fn: (actual, expected) => {
		let result = false;
		try {
			actual();
		} catch (err) {
			if (!(err instanceof Error)) {
				throw new Error("Expected an Error object to be thrown");
			}
			if (expected instanceof RegExp) {
				result = expected.test(err.message);
			} else if (typeof expected === "string") {
				result = err.message.includes(expected);
			} else {
				result = true;
			}
		}

		return result;
	},
});
