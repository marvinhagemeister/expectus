const hasSet = typeof Set !== "undefined";
const hasMap = typeof Map !== "undefined";
const hasWeakSet = typeof WeakSet !== "undefined";
const hasWeakMap = typeof WeakMap !== "undefined";

// IE11 has no iterator methods, but supports Sets
function toArray<T>(x: Set<T> | Map<any, T>): T[] {
  const out: T[] = [];
  x.forEach((v: any) => out.push(v));
  return out;
}

function compareIterator(a: any[], b: any[], seen: Set<any>) {
  for (let i = 0; i < a.length; i++) {
    if (!deepEqual(a[i], b[i], seen)) return false;
  }
  return true;
}

export function deepEqual<T>(a: T, b: T, seen = new Set<any>()): boolean {
  if (seen.has(a) && seen.has(b)) return true;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    seen.add(a);
    seen.add(b);

    return compareIterator(a, b, seen);
  } else if (hasSet && a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;
    seen.add(a);
    seen.add(b);
    return compareIterator(toArray(a), toArray(b), seen);
  } else if (hasMap && a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;
    seen.add(a);
    seen.add(b);

    const aKeys: any[] = [];
    const bKeys: any[] = [];
    const aValues: any[] = [];
    const bValues: any[] = [];

    a.forEach((v, k) => {
      aValues.push(v);
      aKeys.push(k);
    });
    b.forEach((v, k) => {
      bValues.push(v);
      bKeys.push(k);
    });

    return (
      compareIterator(aKeys, bKeys, seen) &&
      compareIterator(aValues, bValues, seen)
    );
  } else if (a instanceof Date) {
    if (!(b instanceof Date)) return false;
    return a.getTime() === b.getTime();
  } else if (a instanceof RegExp) {
    if (!(b instanceof RegExp)) return false;
    return String(a) === String(b);
  } else if (a !== null && typeof a === "object") {
    if (b === null || typeof b !== "object") return false;
    seen.add(a);
    seen.add(b);
    for (let i in a) if (!(i in b)) return false;
    for (let i in b) if (!deepEqual(a[i], b[i], seen)) return false;
    return true;
  } else if (typeof a === "function") {
    if (typeof b !== "function") return false;
    return true;
  }

  return a === b;
}
