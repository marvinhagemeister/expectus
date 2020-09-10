export function formatArray(arr: any[]): string {
  return `[${arr.map((x) => format(x)).join(", ")}]`;
}

export function formatPrimitive(x: any): string {
  if (typeof x === "string") {
    return `"${x}"`;
  }
  return String(x);
}

export function format(x: any): string {
  if (Array.isArray(x)) {
    return formatArray(x);
  }

  return formatPrimitive(x);
}

export function printDiff(actual: any, expected: any) {
  return `- Expected\n+ Received\n\n`;
}

export function formatType(x: any) {
  if (Array.isArray(x)) return `Array(${x.length})`;
  if (x instanceof Map) return `Map(${x.size})`;
  if (x instanceof Set) return `Set(${x.size})`;
  const type = typeof x;
  if (type === "function") return `function ${x.name || "anonymous"}() {}`;
  if (x !== null && type === "object") return `Object{}`;
  return formatPrimitive(x);
}

export function printShortDiff(actual: any, expected: any) {
  return `- Expected: ${formatType(actual)}\n+ Received: ${formatType(
    expected
  )}\n\n`;
}
