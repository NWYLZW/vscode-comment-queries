export type Cast<A, B> = A extends B ? A : B;

export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type Narrow<T> = Cast<T, [] | (T extends Primitive ? T : never) | ({ [K in keyof T]: Narrow<T[K]> })>;

export function narrow<T>(value: T) {
  return value as Narrow<T>;
}

export function narrowCurry<O>() {
  return <T extends O>(value: T) => value as Narrow<T>;
}
