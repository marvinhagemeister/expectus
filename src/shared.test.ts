import { strict as assert } from "assert";
import { doesThrow, isPrimitive } from "./shared";

describe.only("shared", () => {
	describe("isPrimitive", () => {
		it("should check false", () => {
			assert.doesNotThrow(() => isPrimitive(1, 1, { invert: false }));
			assert.doesNotThrow(() => isPrimitive(NaN, NaN, { invert: false }));
			assert.doesNotThrow(() => isPrimitive(false, false, { invert: false }));
			assert.doesNotThrow(() => isPrimitive(true, true, { invert: false }));

			assert.throws(() => isPrimitive(1, 2, { invert: false }));
			assert.throws(() => isPrimitive(1, 2, { invert: false }));
			assert.throws(() => isPrimitive({}, {}, { invert: false }));
			assert.throws(() => isPrimitive(true, false, { invert: false }));
			assert.throws(() => isPrimitive("", false, { invert: false }));
			assert.throws(() => isPrimitive(null, false, { invert: false }));
			assert.throws(() => isPrimitive("a", true, { invert: false }));
		});

		it("should invert", () => {
			assert.doesNotThrow(() => isPrimitive(null, false, { invert: true }));
			assert.doesNotThrow(() => isPrimitive(1, 2, { invert: true }));
			assert.throws(() => isPrimitive(false, false, { invert: true }));
			assert.throws(() => isPrimitive(1, 1, { invert: true }));
		});
	});

	describe("doesThrow", () => {
		const thrower = () => {
			throw new Error("fail");
		};

		it("should throw", () => {
			assert.doesNotThrow(() => doesThrow(thrower, Error, { invert: false }));
			assert.doesNotThrow(() => doesThrow(thrower, "fail", { invert: false }));
			assert.doesNotThrow(() => doesThrow(thrower, /fail/, { invert: false }));
			assert.throws(() => doesThrow(thrower, undefined, { invert: false }));
		});

		it("should invert", () => {
			assert.throws(() => doesThrow(thrower, Error, { invert: true }));
		});
	});
});
