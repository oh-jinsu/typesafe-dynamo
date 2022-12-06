/**
 * Default key names of an update date column and a create date column.
 */
const DATE_COLUMN_LIST = ["updatedAt", "createdAt"] as const;

/**
 * Default type of an update date column and a create date column.
 */
export type DateColumnList = typeof DATE_COLUMN_LIST[number];
