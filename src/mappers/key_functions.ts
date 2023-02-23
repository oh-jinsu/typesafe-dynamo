export type KeyFunction = (x: any) => string;

export const exists = (): KeyFunction => (x) => `attribute_exists(${x})`;

export const notExists = (): KeyFunction => (x) => `attribute_not_exists(${x})`;
