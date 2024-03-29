import DataList from "./DataList";
import { getDisplayAlias, getDisplayValue } from "../utils";

export default function List<T extends { [key: string]: any }>({
  fields,
  data,
  deletable = false,
  showHandler,
  selected2Delete,
  selectHandler,
  deleteHandler,
}: {
  fields: Array<Paths<T>>;
  data: T[];
  deletable?: boolean;
  showHandler: (item: T) => void;
  selected2Delete?: Array<string>;
  selectHandler?: (id: string) => void;
  deleteHandler?: VoidFunction;
}) {
  return (
    <div className="px-5 overflow-auto">
      <div className="bg-white rounded-md pb-1">
        <div className="flex items-center rounded-t-md border-b">
          {deletable && (
            <button
              className="py-2 w-[5%] text-red-600 font-semibold hover:bg-slate-50 rounded-tl-md"
              onClick={deleteHandler}
            >
              Del
            </button>
          )}

          <div className="w-full flex items-center justify-between hover:cursor-pointer">
            {fields.map((field, index) => {
              if (typeof getDisplayValue(data[0], field) === "undefined") return null;

              return (
                <button
                  key={index}
                  className={
                    (index ? "w-[12%]" : "grow text-start") +
                    " text-center capitalize p-2 font-semibold hover:bg-slate-50 " +
                    (index === fields.length - 1 ? "rounded-tr-md" : "")
                  }
                >
                  {getDisplayAlias(field)} ▾{/* ▴ */}
                </button>
              );
            })}
          </div>
        </div>

        <DataList
          fields={fields}
          data={data}
          deletable={deletable}
          showHandler={showHandler}
          selected2Delete={selected2Delete}
          selectHandler={selectHandler}
        />
      </div>
    </div>
  );
}
