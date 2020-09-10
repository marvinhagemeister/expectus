import { SinonSpy } from "sinon";
import { formatType, printDiff } from "./print";

// FIXME: .equalNode()
// FIXME: .nested (property)
// FIXME: .not.property()
// FIXME: .throw(RegExp)

function isSinonFn(x: any): x is SinonSpy {
  return typeof x === "function" && "callCount" in x;
}

function assertSinonFn(x: any): x is SinonSpy {
  if (!isSinonFn(x)) {
    throw new Error("Not a spy function");
  }
  return true;
}

const noArg = "__no_argument__";

class AssertionError extends Error {
  constructor(
    public message: string,
    public actual: any = noArg,
    public expected: any = noArg,
    public showDiff = actual !== noArg && expected !== noArg
  ) {
    super(message);
  }
}

export type ValueType =
  | "string"
  | "number"
  | "boolean"
  | "bigint"
  | "function"
  | "object"
  | "array";

class Assertion<T> {
  private _deep = false;
  private _invert = false;
  private _anyKeys = false;
  constructor(public actual: T) {}

  private get _notSuffix() {
    return this._invert ? "not " : "";
  }

  get to() {
    return this;
  }

  get be() {
    return this;
  }

  get have() {
    return this;
  }

  get been() {
    return this;
  }

  get with() {
    return this;
  }

  get and() {
    this._deep = false;
    this._invert = false;
    this._anyKeys = false;
    return this;
  }

  get that() {
    return this;
  }

  get is() {
    return this;
  }

  get deep() {
    this._deep = true;
    return this;
  }

  get any() {
    this._anyKeys = true;
    return this;
  }

  get all() {
    this._anyKeys = false;
    return this;
  }

  get not() {
    this._invert = !this._invert;
    return this;
  }

  get exist() {
    this.assert({
      result: this.actual === null || this.actual === undefined,
      message: `Expected #{act} to equal undefined or null`,
      messageNot: `Expected #{act} not to equal undefined or null`,
      actual: this.actual,
    });
    return this;
  }

  get false() {
    this.assert({
      result: (this.actual as any) !== false,
      message: `Expected #{act} to be false`,
      messageNot: `Expected #{act} not to be false`,
      actual: this.actual,
      expected: false,
    });
    return this;
  }
  get true() {
    this.assert({
      result: (this.actual as any) !== true,
      message: `Expected #{act} to be true`,
      messageNot: `Expected #{act} not to be true`,
      actual: this.actual,
      expected: true,
    });
    return this;
  }

  get null() {
    this.assert({
      result: (this.actual as any) !== null,
      message: `Expected #{act} to be null`,
      messageNot: `Expected #{act} not to be null`,
      actual: this.actual,
      expected: null,
    });
    return this;
  }

  get undefined() {
    this.assert({
      result: (this.actual as any) !== undefined,
      message: `Expected #{act} to be undefined`,
      messageNot: `Expected #{act} not to be undefined`,
      actual: this.actual,
      expected: undefined,
    });
    return this;
  }

  get called() {
    if (assertSinonFn(this.actual)) {
      this.assert({
        result: this.actual.callCount < 1,
        message: `Expected function #{act} to be called`,
        messageNot: `Expected function #{act} not to be called`,
        actual: this.actual.callCount,
        expected: 1,
      });
    }

    return this;
  }

  get calledOnce() {
    this.assertCallCount(this.actual, 1);
    return this;
  }
  get calledTwice() {
    this.assertCallCount(this.actual, 2);
    return this;
  }
  get calledThrice() {
    this.assertCallCount(this.actual, 3);
    return this;
  }

  equal(expected: T, message?: string) {
    const prefix = message ? message + ": " : "";
    if (this._deep) {
      // FIXME
    } else {
      this.assert({
        result: this.actual !== expected,
        message: `${prefix}Expected #{act} to strictly equal #{exp}`,
        messageNot: `${prefix}Expected #{act} not to strictly equal #{exp}`,
        actual: this.actual,
        expected,
      });
    }

    return this;
  }
  eq(expected: T, message?: string) {
    return this.equal(expected, message);
  }
  eql(expected: T, message?: string) {
    return this.equal(expected, message);
  }
  equals(expected: T, message?: string) {
    return this.equal(expected, message);
  }

  below(expected: number, message?: string) {
    const prefix = message ? message + ": " : "";
    this.assert({
      result: Number(this.actual) >= expected,
      message: `${prefix}Expected #{act} to be below #{exp}`,
      messageNot: `${prefix}Expected #{act} not to be below #{exp}`,
    });
    return this;
  }

  match(regex: RegExp, message?: string) {
    const prefix = message ? message + ": " : "";
    this.assert({
      result: !regex.test(this.actual as any),
      message: `${prefix}Expected input string to match #{exp}`,
      messageNot: `${prefix}Expected input string not to match #{exp}`,
      expected: regex,
      actual: this.actual,
    });
    return this;
  }

  throw(matcher?: RegExp, message?: string) {
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

  property(name: string, value?: any) {
    if (arguments.length === 1) {
      if (!(name in this.actual)) {
        throw new Error("fail");
      }
    } else if ((this.actual as any)[name] !== value) {
      throw new Error("fail");
    }

    return this;
  }

  a(expected: ValueType) {
    const actual = Array.isArray(this.actual) ? "array" : typeof this.actual;
    this.assert({
      result: actual !== expected,
      actual,
      expected,
      message: `Expected #{act} to be a/an #{exp}`,
      messageNot: `Expected #{act} not to be a/an #{exp}`,
    });

    return this;
  }

  an(expected: ValueType) {
    return this.a(expected);
  }

  hasOwnProperty(name: string) {
    this.assert({
      result: !(this.actual as any).hasOwnProperty(name),
      expected: name,
      message: `Expected value to have property #{exp}`,
      messageNot: `Expected value not to have property #{exp}`,
    });

    return this;
  }

  keys(keys: string[]) {
    if (typeof this.actual !== "object") {
      throw new Error("Expected to receive a value of type object");
    }

    const actual = Object.keys(this.actual).sort();
    const expected = keys.sort();
    if (!this._anyKeys && !this._invert && actual.length !== expected.length) {
      throw new AssertionError(
        `Expected object ${this._notSuffix}to have specified keys\n\n` +
          printDiff(actual, expected),
        actual,
        expected
      );
    }

    for (let i = 0; i < actual.length; i++) {
      const res = actual[i] !== expected[i];
      if ((!this._invert && res) || (this._invert && !res)) {
        throw new AssertionError(
          `Expected object ${this._notSuffix}to have specified keys\n\n` +
            printDiff(actual, expected),
          actual,
          expected
        );
      }
    }

    return this;
  }

  instanceof(expected: any, message?: string) {
    const prefix = message ? message + ": " : "";
    this.assert({
      result: !(this.actual instanceof expected),
      message: `${prefix}Expected #{act} to be an instance of #{exp}`,
      messageNot: `${prefix}Expected #{act} not to be an instance of #{exp}`,
      actual: this.actual,
      expected,
    });
    return this;
  }

  instanceOf(expected: any, message?: string) {
    return this.instanceof(expected, message);
  }

  include(value: any, message?: string) {
    const prefix = message ? message + ": " : "";
    this.assert({
      result: !(this.actual as any).includes(value),
      actual: this.actual,
      expected: value,
      message: `${prefix}Expected #{act} to include #{exp}`,
      messageNot: `${prefix}Expected #{act} to include #{exp}`,
    });
    return this;
  }
  includes(value: any, message?: string) {
    return this.include(value, message);
  }
  contain(value: any, message?: string) {
    return this.include(value, message);
  }
  contains(value: any, message?: string) {
    return this.include(value, message);
  }

  lengthOf(expected: any, message?: string) {
    const actual = (this.actual as any).length;
    const prefix = message ? message + ": " : "";
    this.assert({
      result: actual !== expected,
      actual,
      expected,
      message: `${prefix}Expected #{act} to have a length of #{exp}`,
      messageNot: `${prefix}Expected #{act} not to have a length of #{exp}`,
    });
    return this;
  }

  callCount(count: number) {
    this.assertCallCount(this.actual, count);
    return this;
  }

  calledWith(...params: any[]) {
    if (assertSinonFn(this.actual)) {
      const res = !this.actual.calledWith(...params);
      if ((res && !this._invert) || (!res && this._invert)) {
        throw new Error("fail");
      }
    }

    return this;
  }

  calledWithExactly(...params: any[]) {
    if (assertSinonFn(this.actual)) {
      const res = this.actual.calledWithExactly(...params);
      if ((res && !this._invert) || (!res && this._invert)) {
        throw new Error("fail");
      }
    }
    return this;
  }

  calledWithMatch(...params: any[]) {
    if (assertSinonFn(this.actual)) {
      const res = !this.actual.calledWithMatch(...params);
      if ((res && !this._invert) || (!res && this._invert)) {
        throw new Error("fail");
      }
    }

    return this;
  }

  calledOnceWith(...params: any[]) {
    if (assertSinonFn(this.actual)) {
      const res = !this.actual.calledOnceWith(...params);
      if ((res && !this._invert) || (!res && this._invert)) {
        throw new Error("fail");
      }
    }

    return this;
  }

  calledBefore(fn: SinonSpy) {
    if (assertSinonFn(this.actual)) {
      const res = !this.actual.calledBefore(fn);
      if ((res && !this._invert) || (!res && this._invert)) {
        throw new Error("fail");
      }
    }

    return this;
  }

  returned(value: any) {
    if (assertSinonFn(this.actual)) {
      const res = !this.actual.returned(value);
      if ((res && !this._invert) || (!res && this._invert)) {
        throw new Error("fail");
      }
    }

    return this;
  }

  equalNode(expected: Element | null, message = "equalNode") {
    const actual = this.actual as any;

    if (typeof window === "undefined" || !("Node" in window)) {
      throw new Error("Node class (DOM) not found in environment");
    }

    if (expected == null) {
      this.assert({
        result: actual == null,
        message: `${message}: expected node to "== null" but got #{act} instead.`,
        messageNot: `${message}: expected node to not "!= null".`,
        expected: expected,
        actual,
      });
    } else {
      new Assertion(actual).to.be.instanceof(Node, message);
      this.assert({
        result: actual.tagName === expected.tagName,
        message: `${message}: expected node to have tagName #{exp} but got #{act} instead.`,
        messageNot: `${message}: expected node to not have tagName #{act}.`,
        expected: expected.tagName,
        actual: actual.tagName,
      });
      this.assert({
        result: actual === expected,
        message: `${message}: expected #{this} to be #{exp} but got #{act}`,
        messageNot: `${message}: expected #{this} not to be #{exp}`,
        expected,
        actual,
      });
    }
  }

  assert(options: {
    result: boolean;
    message: string;
    messageNot: string;
    actual?: any;
    expected?: any;
  }) {
    let { result, actual, expected, message, messageNot } = options;
    if ((result && !this._invert) || (!result && this._invert)) {
      message = (this._invert ? messageNot : message)
        .replace(/\{\#this\}/g, formatType(this.actual))
        .replace(/\{\#exp\}/g, formatType(expected))
        .replace(/\{\#act\}/g, formatType(actual));
      throw new AssertionError(message, actual, expected);
    }
  }

  private assertCallCount(fn: any, count: number) {
    if (assertSinonFn(fn)) {
      const res = fn.callCount !== count;
      this.assert({
        result: res,
        message: `Expected function to be called ${count} times, but was called ${fn.callCount} times`,
        messageNot: `Expected function not to be called ${count} times`,
        actual: fn.callCount,
        expected: count,
      });
    }
  }
}

export function expect<T>(value: T): Assertion<T> {
  return new Assertion(value);
}
