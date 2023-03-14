type RecordKey = string | number | symbol;

/**
 * It receives a key and value pair and map it.
 */
type KeyValueMapper<K extends RecordKey = string, V = unknown> = (params: [key: K, value: V]) => [key: K, value: V];

/**
 * Converts all the keys of an object in a string to camelcase.
 */
export function mapper<K extends RecordKey = string, V = unknown>(fn: KeyValueMapper<K, V>) {
  return (value: any): any => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value.map(mapper(fn));
    }

    if (value.constructor === Object) {
      return Object.entries(value).reduce((prev, [k, v]: any) => {
        const [key, value] = fn([k, v]);

        return {
          ...prev,
          [key]: value,
        };
      }, {});
    }

    return fn(["" as any, value])[1];
  };
}
