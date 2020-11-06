import { Assertion, assertSinonFn, isSinonFn } from "./assert";
import { isNull } from "./shared";

function notImplemented() {
	return new Error("Not implemented yet");
}

class JestAssertion<T> {
	protected assertion: Assertion<T>;
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
		isNull(this.actual);
	}

	toBeTruthy() {}
	toBeUndefined() {}
	toBeNaN() {}
	toContain() {}
	toContainEqual() {}
	toEqual(expected: T) {
		this.assertion.equal(expected);
	}

	toMatch(regex: RegExp) {
		this.assertion.matches(regex);
	}
	toMatchObject() {}
	toStrictEqual() {}
	toThrow() {}
}

export function expect<T>(actual: T) {
	return new JestAssertion(actual);
}
