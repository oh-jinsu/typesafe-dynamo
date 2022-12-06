import { ConditionReducer } from "../reducers/condition";
import { DirectionReducer } from "../reducers/direction";
import { FilterReducer } from "../reducers/filter";
import { IndexNameReducer } from "../reducers/index_name";
import { KeyReducer } from "../reducers/key";
import { LimitReducer } from "../reducers/limit";
import { ReplaceReducer } from "../reducers/replace";
import { SelectReducer } from "../reducers/select";
import { ValuesReducer } from "../reducers/values";

export type GetBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
  select: SelectReducer<Schema>;
};

export type QueryBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  index: IndexNameReducer;
  condition: ConditionReducer<Schema, PK, SK>;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  limit: LimitReducer;
  direction: DirectionReducer;
};

export type ScanBuilder<Schema, PK extends keyof Schema> = {
  index: IndexNameReducer;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  limit: LimitReducer;
};

export type PutBuilder<Schema> = {
  values: ValuesReducer<Schema>;
};

export type UpdateBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
  replace: ReplaceReducer<Schema, PK, SK>;
};

export type RemoveBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
};
