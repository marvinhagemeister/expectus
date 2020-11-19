import { SinonSpy, assert as sinonAssert } from "sinon";
import { isSinonFn } from "./assert";
import { createAssertion } from "./shared";

export function assertSinonFn(x: any): x is SinonSpy {
	if (!isSinonFn(x)) {
		throw new Error("Not a spy function");
	}
	return true;
}

function createSinonAssertion<T, U>(opts: {
	message: string;
	messageNot: string;
	fn: (actual: T, expected: U) => boolean;
	getActual?: (actual: T, expected: U) => any;
}) {
	return createAssertion<T, U>({
		getActual: opts.getActual,
		message: opts.message,
		messageNot: opts.messageNot,
		fn: (actual, expected) => {
			assertSinonFn(actual);
			return opts.fn(actual as any, expected);
		},
	});
}

export const isCalled = createSinonAssertion<SinonSpy, undefined>({
	message: `Expected function to be called`,
	messageNot: `Expected function not to be called`,
	fn: actual => actual.callCount > 0,
});

export const isCalledTimes = createSinonAssertion<SinonSpy, number>({
	message: `Expected function to be called #{exp} times, but was called #{act} times`,
	messageNot: `Expected function not to be called #{exp} times`,
	getActual: actual => actual.callCount,
	fn: (actual, expected) => actual.callCount === expected,
});

export const isCalledWith = createSinonAssertion<SinonSpy, any[]>({
	message: `Expected function to be called with #{exp}, but was called with #{act}`,
	messageNot: `Expected function not to be called with #{exp}, but was called with #{act}`,
	fn: (actual, expected) => {
		try {
			sinonAssert.calledWith(actual, ...expected);
			return true;
		} catch (e) {
			return false;
		}
	},
});

export const isCalledNthWith = createSinonAssertion<
	SinonSpy,
	[number, ...any[]]
>({
	message: `Expected function to be called with #{exp}, but was called with #{act}`,
	messageNot: `Expected function not to be called with #{exp}, but was called with #{act}`,
	getActual: (actual, expected) => actual.getCall(expected[0]),
	fn: (actual, expected) => {
		const [n, ...args] = expected;
		try {
			actual.getCall(n).calledWith(...args);
			return true;
		} catch (err) {
			return false;
		}
	},
});

export const didReturn = createSinonAssertion<SinonSpy, undefined>({
	message: `Expected function to have returned, but threw`,
	messageNot: `Expected function not to have returned without throwing`,
	fn: actual => actual.returnValues.length > 0,
});

export const didReturnTimes = createSinonAssertion<SinonSpy, number>({
	message: `Expected function to have returned, but threw`,
	messageNot: `Expected function not to have returned without throwing`,
	getActual: actual => actual.returnValues.length,
	fn: (actual, expected) => actual.returnValues.length === expected,
});
