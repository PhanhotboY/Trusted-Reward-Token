import { Dispatch, SetStateAction } from "react";

import BasePopup from "./BasePopup";
import { getDisplayAlias, getDisplayValue, isDate } from "@/src/utils";

type TActionText = string | `${string}:${string}`;
type AsyncVoidFunction = () => Promise<void>;

export default function ViewPopup<T = any>({
  title,
  data,
  fields,
  closeHandler,
  actionText,
  actionHandler,
}: {
  title: string;
  data: T;
  fields: Array<Paths<T>>;
  closeHandler: Dispatch<SetStateAction<T | null>>;
  actionText?: TActionText | Array<TActionText>;
  actionHandler?: AsyncVoidFunction | Array<AsyncVoidFunction>;
}) {
  return (
    <BasePopup
      title={title}
      closeHandler={closeHandler}
      actionText={actionText}
      actionHandler={actionHandler}
    >
      <div className="grid grid-cols-6 gap-x-4">
        {data &&
          fields.map((field, index) => {
            const value = getDisplayValue(data, field);

            return (
              <div className="mb-3 col-span-3" key={index}>
                <span className="block capitalize text-sm font-semibold mb-3">
                  {getDisplayAlias(field)}
                </span>
                <span className="block w-full p-2 border rounded-md">
                  {isDate(value) ? new Date(value).toLocaleString() : value || "NULL"}
                </span>
              </div>
            );
          })}
      </div>
    </BasePopup>
  );
}
