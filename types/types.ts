type JsonValue = string | number | boolean | null | RequestObject | JsonValue[];

export interface RequestObject {
  [key: string]: JsonValue;
}
