import { Dispatch, ReactNode, SetStateAction } from "react";

type TActionText = string | `${string}:${string}`;

export default function BasePopup<T = any>({
  title,
  children,
  closeHandler,
  formId,
  actionText,
  actionHandler,
}: {
  title: string;
  formId?: string;
  actionText?: TActionText | Array<TActionText>;
  actionHandler?: VoidFunction | Array<VoidFunction>;
  closeHandler: Dispatch<SetStateAction<T | null>>;
  children: ReactNode;
}) {
  let actionTexts: Array<string> = Array.isArray(actionText)
    ? actionText
    : actionText
    ? [actionText]
    : [];
  let actionHandlers: Array<VoidFunction> = Array.isArray(actionHandler)
    ? actionHandler
    : actionHandler
    ? [actionHandler]
    : [];
  if (actionTexts.length !== actionHandlers.length) {
    actionTexts = [];
    actionHandlers = [];
  }

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-black flex items-center justify-center opacity-20"></div>

      <div className="bg-white rounded-md m-10 p-5 relative">
        <h2 className="text-2xl font-semibold mb-3 capitalize">{title}</h2>

        {children}

        <div className="flex justify-end">
          {actionTexts.map((text, index) => (
            <ActionButton
              key={index}
              formId={formId!}
              actionText={text}
              actionHandler={actionHandlers[index] || (() => {})}
            />
          ))}

          <button
            className="px-4 py-2 bg-slate-400 text-white rounded-md ml-3"
            onClick={() => closeHandler(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const colors = {
  green: "bg-green-500",
  red: "bg-red-500",
};

const ActionButton = ({
  formId,
  actionText,
  actionHandler,
}: {
  formId: string;
  actionText: string;
  actionHandler: VoidFunction;
}) => {
  const [action, color] = actionText.split(":");

  return (
    <button
      className={
        "px-4 py-2 text-white rounded-md ml-3 capitalize " +
        (colors[color as keyof typeof colors] || colors.green)
      }
      type="submit"
      form={formId}
      onClick={actionHandler}
    >
      {action}
    </button>
  );
};
