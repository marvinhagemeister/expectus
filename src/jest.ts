import { Assertion, assertSinonFn, isSinonFn } from "./assert";
import {
	doesInclude,
	doesIncludeShape,
	doesThrow,
	isAssertNaN,
	isDeepEqual,
	isMatch,
	isNull,
	isUndefined,
} from "./shared";

function notImplemented() {
	return new Error("Not implemented yet");
}

class JestAssertion<T> {
	protected assertion: Assertion<T>;
	protected invert = false;
	constructor(public actual: T) {
		this.assertion = new Assertion(actual);
	}

	toBe(expected: T) {
		this.assertion.is(expected);
	}

	toHaveBeenCalled() {
		this.assertion.called();
	}

	toHaveBeenCalledTimes(count: number) {
		this.assertion.calledTimes(count);
	}

	toHaveBeenCalledWith(...args: any[]) {
		this.assertion.calledWith(...args);
	}

	toHaveBeenLastCalledWith(...args: any[]) {
		if (assertSinonFn(this.actual)) {
			// this.assertion.call(...args);
		}
		throw notImplemented();
	}

	toHaveBeenNthCalledWith(nth: number, ...args: any[]) {
		// this.assertion.call(...args);
		throw notImplemented();
	}

	toHaveReturned() {}

	toHaveReturnedTimes(count: number) {}
	toHaveReturnedWith() {}
	toHaveLastReturnedWith() {}
	toHaveNthReturnedWith() {}

	toHaveLength() {}
	toHaveProperty() {}
	toBeCloseTo() {}
	toBeDefined() {}
	toBeFalsy() {}
	toBeGreaterThan() {}
	toBeGreaterThanOrEqual() {}
	toBeLessThan() {}
	toBeLessThanOrEqual() {}
	toBeInstanceOf() {}

	toBeNull() {
		isNull(this.actual, { invert: this.invert });
	}

	toBeTruthy() {}

	toBeUndefined() {
		isUndefined(this.actual, { invert: this.invert });
	}

	toBeNaN() {
		isAssertNaN(this.actual as any, { invert: this.invert });
	}

	toContain(value: any) {
		doesInclude(this.actual, value, { invert: this.invert });
	}

	toContainEqual(value: any) {
		doesIncludeShape(this.actual, value, { invert: this.invert });
	}

	toEqual(expected: T) {
		isDeepEqual(this.actual, expected, { invert: this.invert });
	}

	toMatch(regex: RegExp) {
		isMatch(this.actual as any, regex, { invert: this.invert });
	}

	toMatchObject() {}
	toStrictEqual() {}

	toThrow(err?: RegExp | string | Error) {
		doesThrow(this.actual as any, err, { invert: this.invert });
	}

	toThrowError(err?: RegExp | string | Error) {
		this.toThrow(err);
	}
}

export function expect<T>(actual: T) {
	return new JestAssertion(actual);
}
