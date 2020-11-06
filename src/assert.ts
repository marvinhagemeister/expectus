import { SinonSpy } from "sinon";
import { formatType, printDiff } from "./print";
import { AssertionError, objectIs, isEqual, isDeepEqual } from "./shared";

// FIXME: .equalNode()
// FIXME: .throw(RegExp)
// FIXME: reset flags

export function isSinonFn(x: any): x is SinonSpy {
	return x != null && "callCount" in x;
}

export function assertSinonFn(x: any): x is SinonSpy {
	if (!isSinonFn(x)) {
		throw new Error("Not a spy function");
	}
	return true;
}

export class Assertion<T> {
	_deep = false;
	_invert = false;
	_anyKeys = false;
	_nestedProperty = false;
	constructor(public actual: T) {}

	get _notSuffix() {
		return this._invert ? "not " : "";
	}

	get not() {
		this._invert = !this._invert;
		return this;
	}

	called() {
		if (assertSinonFn(this.actual)) {
			this._assert({
				result: this.actual.callCount > 0,
				message: `Expected function to be called`,
				messageNot: `Expected function not to be called`,
				actual: this.actual.callCount,
			});
		}
	}

	calledTimes(count = 1) {
		this._assertCallCount(this.actual, count);
	}

	equal(expected: T, message?: string) {
		const prefix = message ? message + ": " : "";
		if (this._deep) {
			isDeepEqual(this.actual, expected);
		} else {
			isEqual(this.actual, expected, message);
		}

		return this;
	}

	matches(regex: RegExp, message?: string) {
		const prefix = message ? message + ": " : "";
		this._assert({
			result: regex.test(this.actual as any),
			message: `${prefix}Expected input string to match #{exp}`,
			messageNot: `${prefix}Expected input string not to match #{exp}`,
			expected: regex,
			actual: this.actual,
		});
		return this;
	}

	throws(matcher?: RegExp, message?: string) {
		if (typeof this.actual !== "function") {
			throw new Error("Actual value is not a function");
		}

		const prefix = message ? message + ": " : "";
		try {
			this.actual();
			if (!this._invert) {
				throw new AssertionError(`${prefix}Expected function to throw`);
			}
		} catch (e) {
			if (this._invert) {
				throw new AssertionError(`${prefix}Expected function not to throw`);
			}
		}

		return this;
	}

	hasProperty(name: string) {
		this._assert({
			result: (this.actual as any).hasOwnProperty(name),
			expected: name,
			message: `Expected value to have property #{exp}`,
			messageNot: `Expected value not to have property #{exp}`,
		});

		return this;
	}

	instanceof(expected: any, message?: string) {
		const prefix = message ? message + ": " : "";
		this._assert({
			result: this.actual instanceof expected,
			message: `${prefix}Expected #{act} to be an instance of #{exp}`,
			messageNot: `${prefix}Expected #{act} not to be an instance of #{exp}`,
			actual: this.actual,
			expected,
		});
		return this;
	}

	include(value: any, message?: string) {
		const prefix = message ? message + ": " : "";
		this._assert({
			result: (this.actual as any).includes(value),
			actual: this.actual,
			expected: value,
			message: `${prefix}Expected #{act} to include #{exp}`,
			messageNot: `${prefix}Expected #{act} to include #{exp}`,
		});
		return this;
	}

	length(expected: number, message?: string) {
		const actual = (this.actual as any).length;
		const prefix = message ? message + ": " : "";
		this._assert({
			result: actual === expected,
			actual,
			expected,
			message: `${prefix}Expected #{this} to have a length of #{exp}, but got #{act} instead.`,
			messageNot: `${prefix}Expected #{this} not to have a length of #{exp}, but got #{act} instead.`,
		});
		return this;
	}

	calledWith(...params: any[]) {
		this._assert({
			result: (this.actual as any).calledWith(...params),
			message:
				"Expected function to be called with #{exp}, but was called with #{act}.",
			messageNot:
				"Expected function not to be called with #{exp}, but was called with #{act}.",
			actual: [], // FIXME
			expected: params,
		});
		return this;
	}

	calledWithExactly(...params: any[]) {
		this._assert({
			result: (this.actual as any).calledWithExactly(...params),
			message:
				"Expected function to be called with exactly #{exp}, but was called with #{act}.",
			messageNot:
				"Expected function not to be called with exactly #{exp}, but was called with #{act}.",
			actual: [], // FIXME
			expected: params,
		});
		return this;
	}

	calledWithMatch(...params: any[]) {
		this._assert({
			result: (this.actual as any).calledWithMatch(...params),
			message:
				"Expected function to be called with match #{exp}, but was called with #{act}.",
			messageNot:
				"Expected function not to be called with match #{exp}, but was called with #{act}.",
			actual: [], // FIXME
			expected: params,
		});
		return this;
	}

	calledOnceWith(...params: any[]) {
		this._assert({
			result: (this.actual as any).calledWithMatch(...params),
			message:
				"Expected function to be called once with #{exp}, but was called with #{act}.",
			messageNot:
				"Expected function not to be called once with #{exp}, but was called with #{act}.",
			actual: [], // FIXME
			expected: params,
		});

		return this;
	}

	returned(value: any) {
		this._assert({
			result: (this.actual as any).returned(value),
			message:
				"Expected function to have returned #{exp}, but returned #{act} instead.",
			messageNot: "Expected function to not have returned #{exp}.",
			actual: (this.actual as any).returnValues
				? (this.actual as any).returnValues[
						(this.actual as any).returnValues.length - 1
				  ]
				: (this.actual as any).returnValue,
			expected: value,
		});
		return this;
	}

	below(expected: number, message?: string) {
		const prefix = message ? message + ": " : "";
		this._assert({
			result: Number(this.actual) < expected,
			message: `${prefix}Expected #{act} to be below #{exp}`,
			messageNot: `${prefix}Expected #{act} not to be below #{exp}`,
		});
		return this;
	}

	equalNode(expected: Element | null, message = "equalNode") {
		const actual = this.actual as any;

		if (typeof window === "undefined" || !("Node" in window)) {
			throw new Error("Node class (DOM) not found in environment");
		}

		if (expected == null) {
			this._assert({
				result: actual == null,
				message: `${message}: expected node to "== null" but got #{act} instead.`,
				messageNot: `${message}: expected node to not "!= null".`,
				expected: expected,
				actual,
			});
		} else {
			new Assertion(actual).instanceof(Node, message);
			this._assert({
				result: actual.tagName === expected.tagName,
				message: `${message}: expected node to have tagName #{exp} but got #{act} instead.`,
				messageNot: `${message}: expected node to not have tagName #{act}.`,
				expected: expected.tagName,
				actual: actual.tagName,
			});
			this._assert({
				result: actual === expected,
				message: `${message}: expected #{this} to be #{exp} but got #{act}`,
				messageNot: `${message}: expected #{this} not to be #{exp}`,
				expected,
				actual,
			});
		}
	}

	is(expected: T, message?: string) {
		objectIs(this.actual, expected, message);
	}

	_assert(options: {
		result: boolean;
		message: string;
		messageNot: string;
		actual?: any;
		expected?: any;
	}) {
		let { result, actual, expected, message, messageNot } = options;
		if ((!result && !this._invert) || (result && this._invert)) {
			message = (this._invert ? messageNot : message)
				.replace(/\#\{this\}/g, formatType(this.actual))
				.replace(/\#\{exp\}/g, formatType(expected))
				.replace(/\#\{act\}/g, formatType(actual));
			throw new AssertionError(message, actual, expected);
		}
	}

	_assertCallCount(fn: any, count: number) {
		if (assertSinonFn(fn)) {
			this._assert({
				result: fn.callCount === count,
				message: `Expected function to be called ${count} times, but was called ${fn.callCount} times`,
				messageNot: `Expected function not to be called ${count} times`,
				actual: fn.callCount,
				expected: count,
			});
		}
	}
}
