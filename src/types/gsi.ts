export type GSIManifest<Schema> = Record<string, GSIElement<Schema>>;

export type GSIElement<Schema> = [keyof Schema, keyof Schema];
