export const VALUE_OPERATOR_ALAIS = "__value_operator__";

export function extractValueOperator(value: any) {
  if (Array.isArray(value) || value?.constructor !== Object) {
    return "=";
  }

  if (VALUE_OPERATOR_ALAIS in value) {
    return value[VALUE_OPERATOR_ALAIS];
  }

  return "=";
}

export function extractValue(value: any) {
  if (Array.isArray(value) || value?.constructor !== Object) {
    return value;
  }

  if (VALUE_OPERATOR_ALAIS in value) {
    return value.value;
  }

  return value;
}
