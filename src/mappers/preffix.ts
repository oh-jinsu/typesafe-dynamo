/**
 * Add a preffix to passed value. This function is idempotent.
 */
export function preffix(preffix: string) {
  return (value: string): string => {
    if (value.startsWith(preffix)) {
      return value;
    }

    return `${preffix}${value}`;
  };
}
