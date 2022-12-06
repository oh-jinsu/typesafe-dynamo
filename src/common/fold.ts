/**
 * Fold object or function.
 */
export const fold = (pre: any, cur: any) => {
  if (typeof cur === "function") {
    return { ...pre, ...cur(pre) };
  }

  return { ...pre, ...cur };
};
