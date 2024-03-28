import { Dispatch, SetStateAction, useState } from "react";
import BasePopup from "./BasePopup";

export default function ConfirmPopup<T = any>({
  title,
  alert,
  closeHandler,
  includeMessage,
  actionText,
  actionHandler,
}: {
  title: string;
  alert: string;
  closeHandler: Dispatch<SetStateAction<T | null>>;
  includeMessage?: boolean;
  actionText: string;
  actionHandler: (message?: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const formId = `popup-form-${title}`;

  const submitHandler = async () => {
    await actionHandler(message);
  };

  return (
    <BasePopup<T>
      title={title}
      closeHandler={closeHandler}
      formId={formId}
      actionText={actionText}
      actionHandler={includeMessage ? () => {} : actionHandler}
    >
      {includeMessage || alert}

      {includeMessage && (
        <form id={formId} className="grid grid-cols-6 gap-4" onSubmit={submitHandler}>
          <div className="mb-3 col-span-full">
            <label htmlFor="confirm-message" className="block text-sm font-semibold capitalize">
              Confirm Message
            </label>

            <textarea
              id="confirm-message"
              className="w-full p-2 border rounded-md"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </form>
      )}
    </BasePopup>
  );
}
