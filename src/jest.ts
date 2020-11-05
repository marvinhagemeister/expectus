import { Assertion } from "./assert";

class JestAssertion<T> {
	protected assertion: Assertion<T>;
	constructor(actual: T) {
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
		this.assertion.call(...args);
	}

	toHaveBeenNthCalledWith(nth: number, ...args: any[]) {
		this.assertion.call(...args);
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
	toBeNull() {}
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
