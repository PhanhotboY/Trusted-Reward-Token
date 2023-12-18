import _ from "lodash";

// export * from './database';
export * from "./keytoken";

type TFilter = Partial<Record<"fields" | "excludes", string[]>>;

function getReturnData(tuple: Object, filter?: TFilter) {
  const picked = _.isEmpty(filter?.fields || []) ? tuple : _.pick(tuple, filter?.fields!);
  return _.omit(picked as Object, filter?.excludes || []) as Object;
}

function getReturnArray(tupleArr: Array<Object>, filter?: TFilter): Object {
  return tupleArr.map((tup) => {
    if (Array.isArray(tup)) return getReturnArray(tup, filter);
    return getReturnData(tup, filter);
  });
}

const isNullish = (val: any) => (val ?? null) === null;
const isEmptyObj = (obj: Object) => !Object.keys(obj).length;
const getSkipNumber = (limit: number, page: number) => limit * (page - 1);
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

export { getReturnArray, getReturnData, removeNestedNullish };
