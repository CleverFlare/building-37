export function mapToVariant<T, B extends string | number | symbol>(
  map: Record<B, T>,
  defaultValue: T,
  value: B,
): T {
  if (!map?.[value]) return defaultValue;

  return map[value];
}
