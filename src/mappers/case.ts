/**
 * Convert characters in a string to snake case.
 */
export const toSnakeCase = (value: string): string => {
  return value
    .replace(/[a-z][A-Z]/g, ([first, second]) => `${first}_${second.toLowerCase()}`)
    .replace(/^[A-Z]/, (matched) => matched.toLowerCase())
    .replace("-", "_");
};

/**
 * Convert characters in a string to camel case.
 */
export const toCamelCase = (value: string): string => {
  return value.replace(/[a-z][_|-][a-z]/g, (matched) => `${matched[0]}${matched[2].toUpperCase()}`).replace(/^[A-Z]/, (matched) => matched.toLowerCase());
};
