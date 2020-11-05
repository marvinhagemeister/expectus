import { Assertion } from "./assert";

export function expect<T>(value: T): Assertion<T> {
	return new Assertion(value);
}
