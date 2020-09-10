import { strict as assert } from "assert";
import { deepEqual } from "./deep";

describe("deepEqual", () => {
  it("compares primitives", () => {
    assert.equal(deepEqual(null, null), true);
    assert.equal(deepEqual(undefined, undefined), true);
    assert.equal(deepEqual(1, 1), true);
    assert.equal(deepEqual("a", "a"), true);
    assert.equal(deepEqual(true, true), true);
    assert.equal(deepEqual(false, false), true);

    assert.equal(deepEqual(null, "null"), false);
    assert.equal(deepEqual(null, undefined), false);
    assert.equal(deepEqual(undefined, null), false);
    assert.equal(deepEqual(1, 0), false);
    assert.equal(deepEqual("a", "b"), false);
    assert.equal(deepEqual(true, false), false);
    assert.equal(deepEqual(false, true), false);
  });

  it("compares arrays", () => {
    assert.equal(deepEqual([1], [1]), true);
    assert.equal(deepEqual([1, [1]], [1, [1]]), true);

    assert.equal(deepEqual([1], [1, 2]), false);
  });

  it("compares objects", () => {
    assert.equal(deepEqual({ foo: 1 }, { foo: 1 }), true);
    assert.equal(deepEqual({ foo: { bar: 1 } }, { foo: { bar: 1 } }), true);

    assert.equal(deepEqual({ foo: 1 }, { bar: 1 }), false);
    assert.equal(deepEqual({ foo: { bar: 1 } }, { foo: { bar: 2 } }), false);
  });

  it("compares Dates", () => {
    assert.equal(
      deepEqual(new Date("2020-05-31"), new Date("2020-05-31")),
      true
    );

    assert.equal(
      deepEqual(new Date("2020-05-31"), new Date("2020-04-01")),
      false
    );
  });

  it("compares RegExp", () => {
    assert.equal(deepEqual(/foo/g, /foo/g), true);
    assert.equal(deepEqual(/foo/, /foobar/), false);
    assert.equal(deepEqual(/foo/g, /foo/gi), false);
  });

  it("compares functions", () => {
    assert.equal(
      deepEqual(
        () => null,
        () => null
      ),
      true
    );
    assert.equal(
      deepEqual(
        function foo() {},
        function foo() {}
      ),
      true
    );
    assert.equal(
      deepEqual(
        function foo() {},
        function bar() {}
      ),
      true
    );
  });

  it("compares Sets", () => {
    assert.equal(deepEqual(new Set([1]), new Set([1])), true);
    assert.equal(deepEqual(new Set([1, [1]]), new Set([1, [1]])), true);

    assert.equal(deepEqual(new Set([1]), new Set([1, 2])), false);
  });

  it("compares Maps", () => {
    assert.equal(deepEqual(new Map([[1, 2]]), new Map([[1, 2]])), true);
    assert.equal(deepEqual(new Map([[1, [1]]]), new Map([[1, [1]]])), true);

    assert.equal(
      deepEqual(
        new Map([[1, 1]]),
        new Map([
          [1, 1],
          [2, 2],
        ])
      ),
      false
    );
    assert.equal(
      deepEqual(
        new Map([
          [1, 1],
          [2, 1],
        ]),
        new Map([
          [1, 1],
          [2, 2],
        ])
      ),
      false
    );
  });

  it("compares Symbols", () => {
    assert.equal(deepEqual(Symbol.for("foo"), Symbol.for("foo")), true);
    assert.equal(deepEqual(Symbol.for("foo"), Symbol.for("bar")), false);
  });

  it("deals with circular references", () => {
    const a = { foo: 1 } as any;
    a.foo = a;
    assert.equal(deepEqual(a, a), true);
  });
});
