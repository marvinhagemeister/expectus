import { SinonSpy } from "sinon";
import {
	doesInclude,
	doesIncludeShape,
	doesThrow,
	hasLength,
	hasProperty,
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
	isType,
	ValueType,
} from "./shared";
import {
	didReturn,
	didReturnTimes,
	isCalled,
	isCalledNthWith,
	isCalledTimes,
	isCalledWith,
} from "./sinon";

function notImplemented() {
	return new Error("Not implemented yet");
}

class JestAssertion<T> {
	constructor(public actual: T, public invert = false) {}

	get not() {
		this.invert = !this.invert;
		return this;
	}

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
		isCalledWith(this.actual as any, args, { invert: this.invert });
	}

	toHaveBeenLastCalledWith(...args: any[]) {
		const spy = (this.actual as any) as SinonSpy;
		isCalledNthWith(spy, [spy.callCount - 1, ...args]);
	}

	toHaveBeenNthCalledWith(nth: number, ...args: any[]) {
		isCalledNthWith(this.actual as any, [nth, ...args]);
	}

	toHaveReturned() {
		didReturn(this.actual as any, undefined, { invert: this.invert });
	}

	toHaveReturnedTimes(count: number) {
		didReturnTimes(this.actual as any, count, { invert: this.invert });
	}

	toHaveReturnedWith() {}
	toHaveLastReturnedWith() {
		throw notImplemented();
	}
	toHaveNthReturnedWith() {
		throw notImplemented();
	}

	toHaveLength(n: number) {
		hasLength(this.actual, n, { invert: !this.invert });
	}

	toHaveProperty(path: string | any[], value?: any) {
		hasProperty(this.actual, path, { invert: !this.invert, value });
	}

	toBeCloseTo() {
		throw notImplemented();
	}

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
		isInstanceOf(this.actual, expected, { invert: this.invert });
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

	// Candidates for removal:
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

	toThrowError(err?: RegExp | string | ErrorConstructor) {
		this.toThrow(err);
	}

	// Non-jest stuff
	toBeType(type: ValueType) {
		isType(this.actual, type, { invert: this.invert });
	}
}

export function expect<T>(actual: T) {
	return new JestAssertion(actual);
}
