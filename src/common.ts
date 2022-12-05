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
 * It receives a key and value pair and map it.
 */
type KeyValueMapper<K extends string | number | symbol = string, V = unknown> = (params: [key: K, value: V]) => [key: K, value: V];

/**
 * Converts all the keys of an object in a string to camelcase.
 */
export const map =
  <K extends string | number | symbol = string, V = unknown>(mapper: KeyValueMapper<K, V>) =>
  (value: any): any => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value.map(map(mapper));
    }

    if (value.constructor === Object) {
      return Object.entries(value).reduce((prev, [k, v]: any) => {
        const [key, value] = mapper([k, v]);

        return {
          ...prev,
          [key]: value,
        };
      }, {});
    }

    return mapper(["" as any, value])[1];
  };

/**
 * Converts all the keys of an object in a string to snakecase.
 */
export const mapSnakeCase = map(([key, value]) => [key.toSnakeCase(), value]);

/**
 * Converts all the keys of an object in a string to camelcase.
 */
export const mapCamelCase = map(([key, value]) => [key.toCamelCase(), value]);
