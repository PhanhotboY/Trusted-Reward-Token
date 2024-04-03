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

function durationStringToSeconds(durationString: string) {
  // Regular expression to match each part of the duration string
  const regex = /(\d+)(mo|w|d|h|mi|s)?/g;

  // Object to store the conversion factors for each time unit to seconds
  const conversionFactors = {
    mo: 2592000, // 1 month is approx. 30.44 days
    w: 604800,   // 1 week is 7 days
    d: 86400,    // 1 day is 24 hours
    h: 3600,     // 1 hour is 60 minutes
    mi: 60,      // 1 minute is 60 seconds
    s: 1         // 1 second is 1 second
  };

  let totalSeconds = 0;

  // Iterate over each match in the duration string
  let match;
  while ((match = regex.exec(durationString)) !== null) {
    const value = parseInt(match[1], 10); // Extract the numeric value
    const unit = match[2]; // Extract the time unit (mo, w, d, h, mi, s)

    // Convert the value to seconds and add it to the total
    totalSeconds += value * (conversionFactors[unit as keyof typeof conversionFactors] || 1);
  }

  return totalSeconds;
}

function secondsToDurationString(seconds: number | string) {
  const conversionFactors = {
    months: 2592000, // 1 month is approx. 30.44 days
    weeks: 604800, // 1 week is 7 days
    days: 86400, // 1 day is 24 hours
    hours: 3600, // 1 hour is 60 minutes
    minutes: 60, // 1 minute is 60 seconds
    seconds: 1, // 1 second is 1 second
  };

  let remainingSeconds = +seconds;
  const durationParts = [];

  for (const unit of Object.keys(conversionFactors) as Array<keyof typeof conversionFactors>) {
    const factor = conversionFactors[unit];
    if (factor) {
      // Calculate the number of units and the remaining seconds
      const unitCount = Math.floor(remainingSeconds / factor);
      remainingSeconds %= factor;

      // If the unit count is greater than zero, add it to the duration string
      if (unitCount > 0) {
        durationParts.push(unitCount + ' ' + capitalizeFirstLetter(unit));
      }
    }
  }

  // Join the duration parts into a string and return
  return durationParts.join(" ");
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
  isDate,
  durationStringToSeconds,
  secondsToDurationString
};
