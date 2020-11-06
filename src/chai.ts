import { SinonSpy } from "sinon";
import { Assertion, assertSinonFn } from "./assert";
import { deepEqual } from "./deep";
import { printDiff } from "./print";
import { isFalse, isNull, AssertionError } from "./shared";

function notImplemented() {
	return new Error("Not implemented yet");
}

class ChaiAssertion<T> {
	assertion: Assertion<T>;
	constructor(public actual: T) {
		this.assertion = new Assertion(actual);
	}

	// Chains
	get to() {
		return this;
	}

	get be() {
		return this;
	}

	get been() {
		return this;
	}

	get is() {
		return this;
	}

	get that() {
		return this;
	}

	get which() {
		return this;
	}

	get and() {
		return new ChaiAssertion(this.actual);
	}

	get has() {
		return this;
	}

	get have() {
		return this;
	}

	get with() {
		return this;
	}
	get at() {
		return this;
	}

	get of() {
		return this;
	}

	get same() {
		return this;
	}
	get but() {
		return this;
	}
	get does() {
		return this;
	}

	get still() {
		return this;
	}

	// Modifiers
	get not() {
		this.assertion._invert = true;
		return this;
	}

	get deep() {
		this.assertion._deep = true;
		return this;
	}

	get nested() {
		this.assertion._nestedProperty = true;
		return this;
	}

	get own() {
		// TODO: property + include should ignore inherited properties
		// TODO: Cannot be combined with nested
		throw notImplemented();
	}

	get ordered() {
		// TODO: Requires member to be in the same order
		throw notImplemented();
	}

	get any() {
		// TODO: Match any argument of .keys
		this.assertion._anyKeys = true;
		return this;
	}

	get all() {
		// TODO: Opposite of .any
		this.assertion._anyKeys = false;
		return this;
	}

	a(expected: string) {
		let actual: string = typeof this.actual;
		if (Array.isArray(this.actual)) {
			actual = "array";
		} else if (
			this.actual !== null &&
			actual === "object" &&
			(this.actual as any).constructor &&
			(this.actual as any).constructor.name !== "Object"
		) {
			actual = (this.actual as any).constructor.name;
		}

		this.assertion._assert({
			result: actual === expected,
			actual,
			expected,
			message: `Expected #{act} to be a/an #{exp}`,
			messageNot: `Expected #{act} not to be a/an #{exp}`,
		});

		return this;
	}

	include(value: any, message?: string) {
		this.assertion.include(value, message);
		return this;
	}

	get ok() {
		this.assertion._assert({
			result: !!this.actual,
			actual: this.actual,
			message: `Expected #{act} to be truthy`,
			messageNot: `Expected #{act} not to be truthy`,
		});
		return this;
	}

	get true() {
		this.assertion._assert({
			result: (this.actual as any) === true,
			message: `Expected #{act} to be true`,
			messageNot: `Expected #{act} not to be true`,
			actual: this.actual,
			expected: true,
		});
		return this;
	}

	get false() {
		isFalse(this.actual);
		return this;
	}

	get null() {
		isNull(this.actual);
		return this;
	}

	get undefined() {
		this.assertion._assert({
			result: (this.actual as any) === undefined,
			message: `Expected #{act} to be undefined`,
			messageNot: `Expected #{act} not to be undefined`,
			actual: this.actual,
			expected: undefined,
		});
		return this;
	}

	get NaN() {
		this.assertion._assert({
			result: isNaN(this.actual as any),
			message: `Expected #{act} to be NaN`,
			messageNot: `Expected #{act} not to be NaN`,
			actual: this.actual,
			expected: NaN,
		});
		return this;
	}

	get exist() {
		this.assertion._assert({
			result: this.actual !== null && this.actual !== undefined,
			message: `Expected #{act} to equal undefined or null`,
			messageNot: `Expected #{act} not to equal undefined or null`,
			actual: this.actual,
		});
		return this;
	}

	get empty() {
		let len = -1;
		if (this.actual instanceof Map || this.actual instanceof Set) {
			len = this.actual.size;
		} else if (Array.isArray(this.actual) || typeof this.actual === "string") {
			len = this.actual.length;
		} else {
			throw notImplemented();
		}

		this.assertion._assert({
			result: len === 0,
			message: `Expected #{act} to be empty`,
			messageNot: `Expected #{act} not to be empty`,
			actual: this.actual,
		});
		return this;
	}

	get arguments() {
		throw notImplemented();
	}

	equal(expected: T, message?: string) {
		return this.assertion.is(expected, message);
	}
	eql(expected: T, message?: string) {
		this.assertion._deep = true;
		return this.equal(expected, message);
	}
	eq(expected: T, message?: string) {
		return this.equal(expected, message);
	}
	equals(expected: T, message?: string) {
		return this.equal(expected, message);
	}

	above(expected: T, message?: string) {
		this.assertion.greater(expected, message);
		return this;
	}

	least(expected: T, message?: string) {
		this.assertion.greaterOrEqual(expected, message);
		return this;
	}

	below(expected: T, message?: string) {
		this.assertion.lower(expected, message);
		return this;
	}

	most(expected: T, message?: string) {
		this.assertion.lowerOrEqual(expected, message);
		return this;
	}

	within(start: number, finish: number, message?: string) {
		throw notImplemented();
	}

	instanceOf(expected: any, message?: string) {
		return this.assertion.instanceof(expected, message);
	}

	property(name: string, value?: any, message?: string): ChaiAssertion<any> {
		let actual;
		try {
			actual = this.assertion._nestedProperty
				? name
						.split(/[.[\]]/)
						.filter(Boolean)
						.reduce((acc, key, i, arr) => {
							// Break out early to support 'in' operator later
							if (i + 1 === arr.length) {
								name = key;
								return acc;
							}
							return (acc as any)[key];
						}, this.actual)
				: this.actual;
		} catch (e) {
			// Ignore
		}

		if (arguments.length > 1) {
			this.assertion._assert({
				result:
					actual != null &&
					typeof actual === "object" &&
					name in actual &&
					this.assertion._deep
						? deepEqual((actual as any)[name], value)
						: (actual as any)[name] === value,
				message: `Expected #{this} to have a property ${name} with the value #{exp}.`,
				messageNot: `Expected #{this} not to have a property ${name} with the value #{exp}.`,
				actual: (actual as any)[name],
				expected: value,
			});
		} else {
			this.assertion._assert({
				result: actual != null && typeof actual === "object" && name in actual,
				message: `Expected #{this} to have a property ${name}`,
				messageNot: `Expected #{this} not to have a property ${name}`,
			});
		}

		return new ChaiAssertion(actual ? (actual as any)[name] : actual);
	}

	ownPropertyDescriptor(name: string, descriptor?: any, message?: string) {
		throw notImplemented();
	}

	lengthOf(n: number, message?: string) {
		throw notImplemented();
	}

	match(regex: RegExp, message?: string) {
		throw notImplemented();
	}

	string(str: string, message?: string) {
		throw notImplemented();
	}

	keys(keys: string[]) {
		if (typeof this.actual !== "object") {
			throw new Error("Expected to receive a value of type object");
		}

		const actual = Object.keys(this.actual).sort();
		const expected = keys.sort();
		if (
			!this.assertion._anyKeys &&
			!this.assertion._invert &&
			actual.length !== expected.length
		) {
			throw new AssertionError(
				`Expected object ${this.assertion._notSuffix}to have specified keys\n\n` +
					printDiff(actual, expected),
				actual,
				expected
			);
		}

		for (let i = 0; i < actual.length; i++) {
			const res = actual[i] !== expected[i];
			if (
				(!this.assertion._invert && res) ||
				(this.assertion._invert && !res)
			) {
				throw new AssertionError(
					`Expected object ${this.assertion._notSuffix}to have specified keys\n\n` +
						printDiff(actual, expected),
					actual,
					expected
				);
			}
		}

		return this;
	}

	throw() {
		throw notImplemented();
	}

	respondTo() {
		throw notImplemented();
	}

	itself() {
		throw notImplemented();
	}

	satisfy() {
		throw notImplemented();
	}

	closeTo() {
		throw notImplemented();
	}

	members() {
		throw notImplemented();
	}

	oneOf() {
		throw notImplemented();
	}

	change() {
		throw notImplemented();
	}
	increase() {
		throw notImplemented();
	}
	decrease() {
		throw notImplemented();
	}
	by() {
		throw notImplemented();
	}
	extensible() {
		throw notImplemented();
	}
	sealed() {
		throw notImplemented();
	}
	frozen() {
		throw notImplemented();
	}
	finite() {
		throw notImplemented();
	}
	fail() {
		throw notImplemented();
	}

	haveOwnProperty(name: string) {
		this.assertion.hasProperty(name);
		return this;
	}

	includes(value: any, message?: string) {
		return this.assertion.include(value, message);
	}
	contain(value: any, message?: string) {
		return this.assertion.include(value, message);
	}
	contains(value: any, message?: string) {
		return this.assertion.include(value, message);
	}

	calledBefore(fn: SinonSpy) {
		if (assertSinonFn(this.actual)) {
			const res = !this.actual.calledBefore(fn);
			if (
				(res && !this.assertion._invert) ||
				(!res && this.assertion._invert)
			) {
				throw new Error("fail");
			}
		}

		return this;
	}

	// Sinon-Chai
	get callCount() {
		if (assertSinonFn(this.actual)) {
			this.assertion._assert({
				result: this.actual.callCount >= 1,
				message: `Expected function #{act} to be called`,
				messageNot: `Expected function #{act} not to be called`,
				actual: this.actual.callCount,
				expected: 1,
			});
		}

		return this;
	}

	get calledOnce() {
		this.assertion._assertCallCount(this.actual, 1);
		return this;
	}
	get calledTwice() {
		this.assertion._assertCallCount(this.actual, 2);
		return this;
	}
	get calledThrice() {
		this.assertion._assertCallCount(this.actual, 3);
		return this;
	}

	an(expected: string) {
		return this.a(expected);
	}
}

export function expect<T>(actual: T) {
	return new ChaiAssertion(actual);
}
