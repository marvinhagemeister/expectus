import {
	doesInclude,
	doesIncludeShape,
	doesThrow,
	isDeepEqual,
	isFalsy,
	isGreaterThan,
	isGreaterThanOrEqual,
	isInstanceOf,
	isLessThan,
	isLessThanOrEqual,
	isMatch,
	isPrimitive,
	isTruthy,
} from "./shared";
import { isCalled, isCalledTimes } from "./sinon";

function notImplemented() {
	return new Error("Not implemented yet");
}

class JestAssertion<T> {
	protected invert = false;
	constructor(public actual: T) {}

	toBe(expected: T) {
		isPrimitive(this.actual, expected, { invert: this.invert });
	}

	toHaveBeenCalled() {
		isCalled(this.actual as any, undefined, { invert: this.invert });
	}

	toHaveBeenCalledTimes(count: number) {
		isCalledTimes(this.actual as any, count, { invert: this.invert });
	}

	toHaveBeenCalledWith(...args: any[]) {
		// this.assertion.calledWith(...args);
	}

	toHaveBeenLastCalledWith(...args: any[]) {
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

	toBeDefined() {
		isPrimitive(this.actual, undefined, { invert: !this.invert });
	}

	toBeFalsy() {
		isFalsy(this.actual, undefined, { invert: this.invert });
	}

	toBeGreaterThan(expected: number) {
		isGreaterThan(this.actual as any, expected, { invert: this.invert });
	}

	toBeGreaterThanOrEqual(expected: number) {
		isGreaterThanOrEqual(this.actual as any, expected, { invert: this.invert });
	}

	toBeLessThan(expected: number) {
		isLessThan(this.actual as any, expected, { invert: this.invert });
	}

	toBeLessThanOrEqual(expected: number) {
		isLessThanOrEqual(this.actual as any, expected, { invert: this.invert });
	}

	toBeInstanceOf(expected: any) {
		isInstanceOf(this.actual, expected);
	}

	toBeNull() {
		isPrimitive(this.actual, null, { invert: this.invert });
	}

	toBeTruthy() {
		isTruthy(this.actual, undefined, { invert: this.invert });
	}

	toBeUndefined() {
		isPrimitive(this.actual, undefined, { invert: this.invert });
	}

	toBeNaN() {
		isPrimitive(this.actual, NaN, { invert: this.invert });
	}

	toContain(value: any) {
		doesInclude(this.actual as any, value, { invert: this.invert });
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

	toThrow(err?: RegExp | string | ErrorConstructor) {
		doesThrow(this.actual as any, err, { invert: this.invert });
	}

	toThrowError(err?: RegExp | string | ErrorConstructor) {
		this.toThrow(err);
	}
}

export function expect<T>(actual: T) {
	return new JestAssertion(actual);
}
