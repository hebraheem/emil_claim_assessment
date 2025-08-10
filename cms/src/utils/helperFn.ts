export const sortObjectsByOrderingNumber = <
  T extends Record<string, { orderingNumber?: number }>
>(
  objects: T
): T => {
  return Object.fromEntries(
    Object.entries(objects).sort(
      (a, b) => (a[1]?.orderingNumber || 0) - (b[1]?.orderingNumber || 0)
    )
  ) as T;
};
