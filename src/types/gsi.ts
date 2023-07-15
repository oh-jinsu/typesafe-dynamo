export type GSIIndexName = string;

export type GSIList<Schema> = Record<GSIIndexName, GSIKeyPair<Schema>>;

export type GSIKeyPair<Schema> = [keyof Schema, keyof Schema];
