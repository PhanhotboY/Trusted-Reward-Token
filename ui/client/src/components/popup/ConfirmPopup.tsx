import { Dispatch, SetStateAction } from "react";
import BasePopup from "./BasePopup";

export default function ConfirmPopup<T = any>({
  title,
  alert,
  closeHandler,
  actionText,
  actionHandler,
}: {
  title: string;
  alert: string;
  closeHandler: Dispatch<SetStateAction<T | null>>;
  actionText: string;
  actionHandler: VoidFunction;
}) {
  return (
    <BasePopup<T>
      title={title}
      closeHandler={closeHandler}
      actionText={actionText}
      actionHandler={actionHandler}
    >
      {alert}
    </BasePopup>
  );
}
