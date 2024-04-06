/**
 * 递归Partial, 让类型下的所有属性可undefine
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
