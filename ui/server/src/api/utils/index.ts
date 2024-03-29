import _ from "lodash";
import { Model } from "sequelize";

// export * from './database';
export * from "./keytoken";
export * from "./interface";

type TFilter<T> = Partial<Record<"fields" | "excludes", Array<keyof T>>>;

function getReturnData<T, R = T>(tuple: T, filter?: TFilter<T>): R {
  const plainTuple = tuple instanceof Model ? tuple.toJSON<T>() : tuple;

  const picked = _.isEmpty(filter?.fields || []) ? plainTuple : _.pick(plainTuple, filter?.fields!);
  return <R>_.omit(picked, filter?.excludes || []);
}

function getReturnArray<T, R = T>(tupleArr: Array<T>, filter?: TFilter<T>): Array<R> {
  return <Array<R>>tupleArr.map((tup) => {
    if (Array.isArray(tup)) return getReturnArray(tup, filter);
    return getReturnData<T, R>(tup, filter);
  });
}

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
      if (result?.constructor.name === 'Object' && isEmptyObj(result)) return;

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

      if (result?.constructor.name === 'Object' && isEmptyObj(result)) return;

      final[key] = result;
    }
  });

  return final;
};

const removeNestedNullish = <T>(any: any): T => {
  if (Array.isArray(any)) return removeNullishElements(any as Array<any>) as T;
  if (any?.constructor.name === 'Object') return removeNullishAttributes(any as Object) as T;

  return <T>any;
};

const pickWithNullish = <T extends Object>(obj: T, keys: Array<keyof T>) => {
  const picked = _.pickBy(
    obj,
    (val, key) => keys.includes(<keyof T>key) && (isNullish(val) || val)
  );
  return picked;
};

export {
  getReturnArray,
  getReturnData,
  removeNestedNullish,
  caculateOffset,
  isObj,
  capitalizeFirstLetter,
  pickWithNullish,
};
