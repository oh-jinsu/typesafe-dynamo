declare global {
  interface String {
    /**
     * Converts all the alphabetic characters in a string to snakecase.
     */
    toSnakeCase(): string;

    /**
     * Converts all the alphabetic characters in a string to camelcase.
     */
    toCamelCase(): string;
  }
}

String.prototype.toSnakeCase = function () {
  return this.replace(/[a-z][A-Z]/g, ([first, second]) => `${first}_${second.toLowerCase()}`);
};

String.prototype.toCamelCase = function () {
  return this.replace(/[a-z]_[a-z]/g, (matched) => `${matched[0]}${matched[2].toUpperCase()}`);
};

/**
 * Converts all the keys of an object in a string to snakecase.
 */
export const toSnakeCase = (value: any): any => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(toSnakeCase);
  }

  if (value.constructor === Object) {
    return Object.entries(value).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key.toSnakeCase()]: toSnakeCase(value),
      }),
      {},
    );
  }

  return value;
};

/**
 * Converts all the keys of an object in a string to camelcase.
 */
export const toCamelCase = (value: any): any => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(toCamelCase);
  }

  if (value.constructor === Object) {
    return Object.entries(value).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key.toCamelCase()]: toCamelCase(value),
      }),
      {},
    );
  }

  return value;
};
