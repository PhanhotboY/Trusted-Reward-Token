import { usePathname } from "next/navigation";
import { getDisplayValue } from "../utils";

export default function DataList<T>({
  fields,
  data,
  deletable,
  showHandler,
  selected2Delete,
  selectHandler,
}: {
  fields: Array<Paths<T>>;
  data: Array<T>;
  deletable?: boolean;
  showHandler: (item: T) => void;
  selected2Delete?: Array<string>;
  selectHandler?: (id: string) => void;
}) {
  const pathname = usePathname();

  return data.length ? (
    <ul>
      {data.map((item, index) => (
        <li className="flex items-center hover:bg-slate-100" key={index}>
          {deletable && (
            <input
              type="checkbox"
              className="w-[5%] h-4"
              checked={
                selected2Delete?.includes(item?.id) || selected2Delete?.includes(item?.orgId)
              }
              onChange={() => selectHandler && selectHandler(item?.id as string)}
            />
          )}

          <div
            className="w-full flex items-center justify-between hover:cursor-pointer"
            onClick={() => showHandler && showHandler(item)}
          >
            {fields.map((field, i) => {
              if (typeof getDisplayValue(data[0], field) === "undefined") return null;

              return (
                <span
                  className={"truncate " + (i ? "w-[12%] text-center" : "p-2 grow text-start")}
                  key={i}
                >
                  {getDisplayValue(item, field)?.toString() || "-"}
                </span>
              );
            })}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="p-4">
      <p>{`No ${pathname.split("/").reverse()[0]}`}</p>
    </div>
  );
}