/**
 *
 * @param objects - An object where each key maps to another object containing an `orderingNumber` property.
 * This function sorts the entries of the object based on the `orderingNumber` property.
 * If `orderingNumber` is not defined, it defaults to 0 for sorting purposes.
 * The function returns a new object with the entries sorted in ascending order of `orderingNumber`.
 * @returns A new object with the same keys as the input, but sorted by `orderingNumber`.
 */
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

/** * Formats a string to a human-readable label.
 * Converts underscores to spaces, lowercases the string,
 * and capitalizes the first letter of each word.
 * @param str - The string to format.
 * @returns The formatted label string.
 */
export function formatLabel(str?: string) {
  if (!str) return "-";
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Returns a CSS class for the status badge based on the claim status.
 * @param status - The status of the claim.
 * @returns A string representing the CSS class for the badge.
 */
export function statusBadgeClass(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800";
    case "IN_REVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "CLOSED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/** Formats a date string to a more readable format.
 * @param dateStr - The date string to format.
 * @returns A formatted date string or a placeholder if the input is undefined.
 */
export function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
