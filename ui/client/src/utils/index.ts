"use client";

const isNullish = (val: any) => (val ?? null) === null;
const isEmptyObj = (obj: Object) => !Object.keys(obj).length;
const caculateOffset = (page?: number | string, limit?: number | string) =>
  (+limit! || 0) * (+page! || 0) || 0;
const isObj = (obj: any) => obj instanceof Object && !Array.isArray(obj);
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const removeNullishElements = (arr: Array<any>) => {
  const final: typeof arr = [];

  arr.forEach((ele) => {
    if (!isNullish(ele)) {
      const result = removeNestedNullish(ele);
      if (result instanceof Object && isEmptyObj(result)) return;

      final[final.length] = result;
    }
  });

  return final.filter((ele) => !isNullish(ele) && ele);
};

const removeNullishAttributes = (obj: Object) => {
  const final: typeof obj = {};

  (Object.keys(obj) as Array<keyof typeof obj>).forEach((key) => {
    if (!isNullish(obj[key])) {
      const result = removeNestedNullish<any>(obj[key]);

      if (result instanceof Object && isEmptyObj(result)) return;

      final[key] = result;
    }
  });

  return final;
};

const removeNestedNullish = <T>(any: any): T => {
  if (any instanceof Array) return removeNullishElements(any as Array<any>) as T;
  if (any instanceof Object) return removeNullishAttributes(any as Object) as T;

  return <T>any;
};

const getLocalItem = (key: string) => {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem(key);
    try {
      return JSON.parse(item!);
    } catch (error) {
      return item;
    }
  }
  return null;
};

const setLocalItem = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  }
};

const removeLocalItem = (key: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
};

const getDisplayAlias = (field: Paths<any>) => {
  const first = field.split("||")[0];
  const [keyChain, alias] = first.split(":");
  return alias || keyChain.split(".").pop() || "";
};

const getDisplayValue = <T>(data: T, selector: Paths<T>) => {
  const fields = selector.split("||");

  let value: string | null | undefined = undefined;

  for (const field of fields) {
    const keyChain = field.split(":")[0];

    value = keyChain.split(".").reduce<object | string | undefined>((acc, key) => {
      return (<Object>acc || {})[key as keyof typeof acc];
    }, <Object>data) as string | undefined | null;

    if (value !== undefined) break;
  }

  return value?.toString() || '';
};

const isDate = (str: string | undefined | null) => {
  if (!str) return false;
  let [y, M, d, h, m, s] = str.toString().split(/[- : T Z]/);
  return (!!y && +M <= 12 && +d <= 31 && +h <= 24 && +m <= 60 && +s <= 60);
}

export {
  isNullish,
  removeNestedNullish,
  caculateOffset,
  isObj,
  capitalizeFirstLetter,
  getLocalItem,
  setLocalItem,
  removeLocalItem,
  getDisplayAlias,
  getDisplayValue,
  isDate
};
