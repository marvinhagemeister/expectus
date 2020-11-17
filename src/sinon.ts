import { SinonSpy } from "sinon";
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
	getActual?: (actual: T) => any;
}) {
	return createAssertion<T, U>({
		getActual: opts.getActual,
		message: opts.message,
		messageNot: opts.messageNot,
		fn: (actual, expected) => {
			assertSinonFn(actual);
			return opts.fn(actual, expected);
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
